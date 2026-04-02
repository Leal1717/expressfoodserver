import { BadRequestException, Injectable } from '@nestjs/common';
import { Classe, EstoqueMovimentacao, EstoqueMovimentacaoTipo, Item, ItemTipo, PedidoStatus  } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePedidoDto, OperacionalPagarDto, OperacionalPedirContaDto, OperacionalQueryDto } from './dto';
import { MesasService } from 'src/formatos/mesas/mesas.service';
import { ComandasService } from 'src/formatos/comandas/comandas.service';
import { SenhasService } from 'src/formatos/senhas/senhas.service';
import { PedidosService } from 'src/pedidos/pedidos.service';
import { MovimentacaoService } from 'src/estoque/movimentacao/movimentacao.service';
import { MovimentacaoSalvarDto } from 'src/estoque/movimentacao/dto';


/**
        enum PedidoStatus {
            PENDENTE
            PAGA
            CANCELADA
        }
 */

@Injectable()
export class OperacionalService {

    constructor(
        private prisma: PrismaService,
        private mesa: MesasService,
        private comanda: ComandasService,
        private senha: SenhasService,
        private pedido: PedidosService,
        private estoque: MovimentacaoService,

    ) {}
    




    async inserirPedido(data: CreatePedidoDto) {
        if (data.mesa_id) {
            const mesa = await this.mesa.buscarPorNome(data.mesa_id)
            if (mesa?.status == "CONTA") throw new BadRequestException("Essa mesa não pode receber mais pedidos pois encontra-se EM CONTA")
            await this.mesa.setStatus(data.mesa_id!, "OCUPADA")
        }
        if (data.comanda_id) await this.comanda.setStatus(data.comanda_id!, "OCUPADA")
        if (data.criar_senha == true) {
            const senhaCriada = await this.senha.criarSenhaOrdem()
            data.senha_id = senhaCriada.numero!
        }
        return this.pedido.salvar(data)
    }





    
    async conta(data: OperacionalPedirContaDto) {
        if (data.mesa) return this.mesa.setStatus(data.mesa!, "CONTA")
        if (data.comanda) return this.comanda.setStatus(data.comanda!, "CONTA")
        throw new BadRequestException("Param da query precisa ser informado com o id de um dos formatos: mesa | comanda ")
    }





    









    async pagar(data: OperacionalPagarDto) {
        // 1. Identifica o filtro do pedido
        let wherePedido: any = {};
        if (data.mesa) wherePedido = { mesa_id: data.mesa };
        else if (data.comanda) wherePedido = { comanda_id: data.comanda };
        else if (data.senha) wherePedido = { senha_id: data.senha };
        else throw new BadRequestException("Informe mesa, comanda ou senha.");

        // 2. Iniciamos UMA ÚNICA transação para tudo
        return await this.prisma.$transaction(async (tx) => {
            
            // A. BUSCA DADOS COMPLETOS (Para Estoque e Histórico)
            const pedidos = await tx.pedido.findMany({
                where: { ...wherePedido, status: "PENDENTE" },
                include: {
                    usuario: true,
                    itens: {
                        include: {
                            item: true,
                            subitens: { include: { subitem: true } }
                        }
                    }
                }
            });

            if (pedidos.length === 0) throw new BadRequestException("Nenhum pedido pendente encontrado.");

            const totalVenda = pedidos.reduce((acc, p) => acc + Number(p.total), 0);
            const totalDesconto = pedidos.reduce((acc, p) => acc + Number(p.desconto), 0);

            // B. MOVIMENTAÇÃO DE ESTOQUE (Integrada na tx)
            const todosItens = pedidos.flatMap(p => p.itens);
            const todosSubitens = todosItens.flatMap(i => i.subitens);
            const subitensParaEstoque = todosSubitens.filter(si => si.subitem.controla_estoque);

            for (const si of subitensParaEstoque) {
                // Registra a movimentação
                await tx.estoqueMovimentacao.create({
                    data: {
                        subitem_id: si.subitem_id,
                        quantidade: si.quantidade,
                        tipo: "VENDA",
                        empresa_id: pedidos[0].empresa_id,
                        referencia: `venda:${pedidos[0].id}`
                    }
                });

                // Baixa a posição física
                await tx.estoquePosicao.update({
                    where: { subitem_id: si.subitem_id },
                    data: { quantidade_fisica: { decrement: si.quantidade } }
                });
            }

            // C. GERAÇÃO DO HISTÓRICO (SNAPSHOT)
            const historico = await tx.vendaHistorico.create({
                data: {
                    empresa_id: pedidos[0].empresa_id,
                    total: totalVenda,
                    desconto: totalDesconto,
                    status: "PAGA",
                    usuario_nome: pedidos[0].usuario.nome,
                    usuario_email: pedidos[0].usuario.email,
                    itens_json: todosItens as any,
                    pagamento_json: data.pagamentos as any // Assumindo que seu DTO de pagar recebe os pagamentos
                }
            });

            // Grava Itens e Subitens no histórico (para os seus relatórios flat)
            for (const item of todosItens) {
                await tx.vendaHistoricoItem.create({
                    data: {
                        venda_historico_id: historico.id,
                        nome: item.item.nome,
                        preco: item.preco,
                        quantidade: Number(item.quantidade)
                    }
                });
            }

            for (const si of todosSubitens) {
                await tx.vendaHistoricoSubitem.create({
                    data: {
                        venda_historico_id: historico.id,
                        nome: si.subitem.nome,
                        preco: si.preco,
                        quantidade: Number(si.quantidade)
                    }
                });
            }

            // D. ATUALIZA STATUS OPERACIONAIS
            // Marca pedidos como pagos e limpa vínculos
            await tx.pedido.updateMany({
                where: wherePedido,
                data: { 
                    status: "PAGA", 
                    mesa_id: null, 
                    comanda_id: null, 
                    senha_id: null,
                    formato: data.mesa ? "MESA" : data.comanda ? "COMANDA" : "SENHA"
                }
            });

            // Libera Mesa/Comanda/Senha usando seus serviços existentes (mas dentro da transação tx)
            if (data.mesa) await tx.mesa.update({ where: { nome_empresa_id: { nome: data.mesa, empresa_id: pedidos[0].empresa_id } }, data: { status: "LIVRE" } });
            if (data.comanda) await tx.comanda.update({ where: { nome_empresa_id: { nome: data.comanda, empresa_id: pedidos[0].empresa_id } }, data: { status: "PAGA" } });
            if (data.senha) await tx.senha.delete({ where: { numero_empresa_id: { numero: data.senha, empresa_id: pedidos[0].empresa_id } } });

            return historico;
        });
    }


























    
    async buscarPorFormato(tipo:string) {
        if (tipo == "mesa") {
            return this.prisma.tenantClient.pedido.findMany({ where: { NOT: { mesa_id: null }} })
        }
        if (tipo == "comanda") {
            return this.prisma.tenantClient.pedido.findMany({ where: { NOT: { comanda_id: null }} })
        }
        if (tipo == "senha") {
            return this.prisma.tenantClient.pedido.findMany({ where: { NOT: { senha_id: null }} })
        }
        throw new BadRequestException("Param da query 'tipo' precisa ser informado com: mesa | comanda | senha")
    }






    async buscarQuery(query: OperacionalQueryDto) {
        const tipos = [query.mesa, query.comanda, query.senha]
        const indefinidos = tipos.filter(e => !e)
        console.log(indefinidos)
        if (indefinidos.length == 1 ) {
            throw new BadRequestException("Mais de um formato foi dado (mesa, comanda, senha). Apenas um desses pode vir nao nulo.")
        }

        return this.prisma.pedido.findMany({
            where: {
                usuario_id: query.usuario ? Number(query.usuario) : undefined,
                status: query.status,
                mesa_id: query.mesa ? (query.mesa) : undefined,
                comanda_id: query.comanda,
                senha_id: query.senha,
            },
            include: {
                senha: true,
                comanda: true,
                mesa: true,
                itens: {
                    include: {
                        item: {
                            include: {
                                subitens: true
                            }
                        },
                    }
                }
            }
        })
    }

    async mapaDeMesas() {
        return await this.prisma.mesa.findMany({
            include: { pedidos: true }
        })
    }

    async buscarMesa(nome: string) {
        const total = await this.prisma.tenantClient.pedido.aggregate({_sum: { total: true , desconto: true}, where: { mesa_id : nome } })
        const item = await this.prisma.tenantClient.mesa.findFirst({ where: {  nome: nome }, include: {  pedidos: { include: { itens: { include: { subitens: true } } } } } })
        return {
            ...item, total: total._sum
        }
    }

    async buscarSenha(numero: number) {
        
        const total = await this.prisma.tenantClient.pedido.aggregate({_sum: { total: true , desconto: true}, where: { senha_id: Number(numero) } })
        const item = await this.prisma.tenantClient.senha.findFirst({ where: {  numero: Number(numero) }, include: {  pedidos: { include: { itens: { include: { subitens: true } } } } }})
        return {
            ...item, total: total._sum
        }
    }

    async buscarComanda(nome: string) {
        const total = await this.prisma.tenantClient.pedido.aggregate({_sum: { total: true , desconto: true}, where: { comanda_id: nome } })
        const item = await this.prisma.tenantClient.comanda.findFirst({ where: {  nome: nome }, include: {  pedidos: { include: { itens: { include: { subitens: true } } } } } })
        return {
            ...item, total: total._sum
        }
    }


    async buscarKds() {
        const geral = await this.prisma.pedido.findMany({
            where: {
                status: "PENDENTE",
            },
            orderBy: {
                updated_at: "asc"
            },
            include: {
                itens: {
                    include: {
                        subitens: true
                    }
                }
            }
        })

        return geral
    }


    // ------------------------------------------------------------------------------------------------------------------------------------------------------ OPERACOES DE ESTOQUE
    



    async buscarMovimentacaoAtual() {
        return this.prisma.tenantClient.subitem.findMany({
            where: { ativo: true, controla_estoque: true },
            include: {  }
        })
    }


    async buscarMovimentacaoPorSubitem(id: number) {
        return this.prisma.subitem.findFirst({
            where: { id: id },
            include: { estoque_movimentacao: { orderBy: { created_at: "asc" } } }
        })
    }


    /**
     * aqui vamos inserir uma movimentacao
     * 
     * pode ser ENTRADA: quando adicionamso um item no estoque (compra, recebimento)
     * pode ser SAIDA: perda, despercidcio, roubo, uso interno, transferencia entre estoques
     * pode ser AJUSTE: corrigindo o estoque manualmente, corrigir erro antigo, sincronizar, etc
     */
    async movimentarEstoque(dto: MovimentacaoSalvarDto) {
        await this.estoque.salvar(dto)
        let tipoCalculo = {}
        if (dto.tipo == "AJUSTE") tipoCalculo = { increment: dto.quantidade }
        if (dto.tipo == "ENTRADA") tipoCalculo = { increment: dto.quantidade }
        if (dto.tipo == "SAIDA") tipoCalculo = { decrement: dto.quantidade }
        return this.prisma.estoquePosicao.updateMany({
            where: { subitem_id: dto.subitem_id },
            data: { quantidade_fisica: tipoCalculo }
        })
    }










    
}

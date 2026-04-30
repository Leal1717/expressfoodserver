import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlterarDeliveryStatusDto, CriarComandaDto, CreatePedidoDto, OperacionalPagarDto, OperacionalPedirContaDto, OperacionalQueryDto } from './dto';
import { MesasService } from 'src/formatos/mesas/mesas.service';
import { ComandasService } from 'src/formatos/comandas/comandas.service';
import { SenhasService } from 'src/formatos/senhas/senhas.service';
import { PedidosService } from 'src/pedidos/pedidos.service';
import { MovimentacaoService } from 'src/estoque/movimentacao/movimentacao.service';
import { MovimentacaoSalvarDto } from 'src/estoque/movimentacao/dto';
import { TenantService } from 'src/tenant/tenant.service';


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
        private tenant: TenantService,
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
        let wherePedido: any = {};
        if (data.mesa)         wherePedido = { mesa_id: data.mesa };
        else if (data.comanda) wherePedido = { comanda_id: data.comanda };
        else if (data.senha)   wherePedido = { senha_id: data.senha };
        else if (data.pedido_id) wherePedido = { id: data.pedido_id };
        else throw new BadRequestException("Informe mesa, comanda, senha ou pedido_id.");

        const empresaId = Number(this.tenant.empresaId);

        return await this.prisma.$transaction(async (tx) => {

            // A. Busca pedidos com todos os dados necessários
            const pedidos = await tx.pedido.findMany({
                where: { ...wherePedido, status: "PENDENTE", empresa_id: empresaId },
                include: {
                    usuario: true,
                    terminal: { select: { id: true, nome: true } },
                    itens: {
                        include: {
                            item: { include: { classe: { select: { id: true, nome: true } } } },
                            subitens: { include: { subitem: true } },
                        },
                    },
                },
            });

            if (pedidos.length === 0) throw new BadRequestException("Nenhum pedido pendente encontrado.");

            const totalVenda    = pedidos.reduce((acc, p) => acc + Number(p.total), 0);
            const totalDesconto = pedidos.reduce((acc, p) => acc + Number(p.desconto), 0);
            const gorjeta       = data.gorjeta ?? 0;
            const todosItens   = pedidos.flatMap(p => p.itens);
            const todosSubitens = todosItens.flatMap(i => i.subitens);
            const now = new Date();

            // B. Movimentação de estoque
            const subitensParaEstoque = todosSubitens.filter(si => si.subitem.controla_estoque);
            for (const si of subitensParaEstoque) {
                await tx.estoqueMovimentacao.create({
                    data: {
                        subitem_id: si.subitem_id,
                        quantidade: si.quantidade,
                        tipo: "VENDA",
                        empresa_id: empresaId,
                        referencia: `venda:${pedidos[0].id}`,
                    },
                });
                await tx.estoquePosicao.update({
                    where: { subitem_id: si.subitem_id },
                    data: { quantidade_fisica: { decrement: si.quantidade } },
                });
            }

            // C. Busca detalhes das formas de pagamento para o snapshot
            const formasPagamento = await Promise.all(
                data.pagamentos.map(p =>
                    tx.empresaFormaPagamento.findFirst({
                        where: { id: p.forma_pagamento_id },
                        include: { forma_pagamento: true },
                    })
                )
            );

            // D. Cria VendaHistorico (snapshot imutável)
            const historico = await tx.vendaHistorico.create({
                data: {
                    empresa_id: empresaId,
                    total: totalVenda,
                    desconto: totalDesconto,
                    gorjeta,
                    status: "PAGA",
                    usuario_id: pedidos[0].usuario_id,
                    usuario_nome: pedidos[0].usuario.nome,
                    usuario_email: pedidos[0].usuario.email,
                    terminal_id: pedidos[0].terminal_id ?? null,
                    terminal_nome: pedidos[0].terminal?.nome ?? null,
                    itens_json: todosItens as any,
                    pagamento_json: data.pagamentos as any,
                },
            });

            // E. VendaHistoricoItem (flat, sem FK externa)
            for (const pedidoItem of todosItens) {
                const itemTotal = Number(pedidoItem.preco) * Number(pedidoItem.quantidade) - Number(pedidoItem.desconto ?? 0);
                await tx.vendaHistoricoItem.create({
                    data: {
                        venda_historico_id: historico.id,
                        empresa_id: empresaId,
                        item_id: pedidoItem.item_id,
                        nome: pedidoItem.item.nome,
                        classe_id: pedidoItem.item.classe_id ?? null,
                        classe_nome: pedidoItem.item.classe?.nome ?? null,
                        quantidade: Number(pedidoItem.quantidade),
                        preco: pedidoItem.preco,
                        desconto: pedidoItem.desconto ?? 0,
                        total: itemTotal,
                        created_at: now,
                    },
                });
            }

            // F. VendaHistoricoSubitem (flat)
            for (const si of todosSubitens) {
                const siTotal = Number(si.preco) * Number(si.quantidade);
                await tx.vendaHistoricoSubitem.create({
                    data: {
                        venda_historico_id: historico.id,
                        empresa_id: empresaId,
                        subitem_id: si.subitem_id,
                        nome: si.subitem.nome,
                        quantidade: Number(si.quantidade),
                        preco: si.preco,
                        total: siTotal,
                        created_at: now,
                    },
                });
            }

            // G. VendaHistoricoPagamento + PedidoPagamento
            for (let i = 0; i < data.pagamentos.length; i++) {
                const pag = data.pagamentos[i];
                const fp  = formasPagamento[i];

                await tx.vendaHistoricoPagamento.create({
                    data: {
                        venda_historico_id: historico.id,
                        empresa_id: empresaId,
                        valor: pag.valor,
                        valor_liquido: pag.valor, // taxa calculada em relatório separado
                        forma_pagamento: fp?.forma_pagamento.nome ?? 'Desconhecido',
                        tipo_pagamento: fp?.forma_pagamento.tipo ?? null,
                        parcelas: pag.parcelas ?? null,
                        created_at: now,
                    },
                });

                await tx.pedidoPagamento.create({
                    data: {
                        pedido_id: pedidos[0].id,
                        empresa_forma_pagamento_id: pag.forma_pagamento_id,
                        terminal_id: pedidos[0].terminal_id ?? null,
                        valor: pag.valor,
                        valor_liquido: pag.valor,
                        troco_para: pag.troco_para ?? null,
                        parcelas: pag.parcelas ?? null,
                    },
                });
            }

            // H. Atualiza status dos pedidos
            const formatoFinal = data.mesa    ? "MESA"
                : data.comanda ? "COMANDA"
                : data.senha   ? "SENHA"
                : pedidos[0].formato ?? "BALCAO";

            await tx.pedido.updateMany({
                where: { ...wherePedido, empresa_id: empresaId },
                // senha_id só é zerado quando o próprio pagar vai deletar a Senha (fluxo PDV com data.senha)
                // assim a referência histórica ao número da senha fica preservada no pedido
                data: {
                    status: "PAGA",
                    mesa_id: null,
                    comanda_id: null,
                    ...(data.senha ? { senha_id: null } : {}),
                    formato: formatoFinal,
                    gorjeta,
                },
            });

            // I. Libera Mesa / Comanda / Senha
            if (data.mesa)    await tx.mesa.update({ where: { nome_empresa_id: { nome: data.mesa, empresa_id: empresaId } }, data: { status: "LIVRE" } });
            if (data.comanda) await tx.comanda.update({ where: { id: data.comanda }, data: { status: "PAGA" } });
            if (data.senha)   await tx.senha.delete({ where: { numero_empresa_id: { numero: data.senha, empresa_id: empresaId } } });

            return historico;
        });
    }


























    
    async buscarPorFormato(tipo: string, desde?: string) {
        const formatos: Record<string, any> = {
            mesa:    { NOT: { mesa_id: null } },
            comanda: { NOT: { comanda_id: null } },
            senha:   { NOT: { senha_id: null } },
            balcao:  { formato: 'BALCAO' },
            delivery:{ formato: 'DELIVERY' },
        };
        const where = formatos[tipo];
        if (!where) throw new BadRequestException("Param 'tipo' deve ser: mesa | comanda | senha | balcao | delivery");

        const desdeDate = desde ? new Date(desde) : null;

        return this.prisma.tenantClient.pedido.findMany({
            where: {
                ...where,
                ...(desdeDate ? { created_at: { gte: desdeDate } } : {}),
            },
            include: {
                itens: {
                    include: {
                        item: true,
                        subitens: { include: { subitem: { select: { id: true, nome: true } } } },
                    },
                },
                cliente:          { select: { id: true, nome: true, telefone: true } },
                endereco_entrega: { select: { id: true, rua: true, numero: true, bairro: true, cidade: true, estado: true } },
                motoboy:          { select: { id: true, nome: true, telefone: true } },
            },
            orderBy: { created_at: 'desc' },
        });
    }






    async buscarQuery(query: OperacionalQueryDto) {
        const definidos = [query.mesa, query.comanda, query.senha].filter(Boolean)
        if (definidos.length > 1) {
            throw new BadRequestException("Mais de um formato foi dado (mesa, comanda, senha). Apenas um desses pode vir não nulo.")
        }

        return this.prisma.tenantClient.pedido.findMany({
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
        return await this.prisma.tenantClient.mesa.findMany({
            include: { pedidos: true }
        })
    }

    async buscarMesa(nome: string) {
        const total = await this.prisma.tenantClient.pedido.aggregate({_sum: { total: true , desconto: true}, where: { mesa_id : nome } })
        const item = await this.prisma.tenantClient.mesa.findFirst({
            where: { nome: nome },
            include: {
                pedidos: {
                    where: { status: 'PENDENTE' },
                    include: {
                        itens: {
                            include: {
                                item: true,
                                subitens: { include: { subitem: { select: { id: true, nome: true } } } }
                            }
                        }
                    }
                }
            }
        })
        return { ...item, total: total._sum }
    }

    async buscarSenha(numero: number) {
        
        const total = await this.prisma.tenantClient.pedido.aggregate({_sum: { total: true , desconto: true}, where: { senha_id: Number(numero) } })
        const item = await this.prisma.tenantClient.senha.findFirst({ where: {  numero: Number(numero) }, include: {  pedidos: { include: { itens: { include: { subitens: true } } } } }})
        return {
            ...item, total: total._sum
        }
    }

    async setSenhaPronta(numero: number, pronta: boolean) {
        return this.prisma.tenantClient.pedido.updateMany({
            where: { senha_id: numero, status: 'PENDENTE' },
            data: { senha_pronta: pronta },
        })
    }

    async buscarComanda(id: string) {
        const total = await this.prisma.tenantClient.pedido.aggregate({_sum: { total: true , desconto: true}, where: { comanda_id: id } })
        const item = await this.prisma.tenantClient.comanda.findUnique({
            where: { id: id },
            include: {
                pedidos: {
                    where: { status: 'PENDENTE' },
                    include: {
                        itens: {
                            include: {
                                item: true,
                                subitens: { include: { subitem: { select: { id: true, nome: true } } } }
                            }
                        }
                    }
                }
            }
        })
        return { ...item, total: total._sum }
    }


    async buscarKds() {
        const geral = await this.prisma.tenantClient.pedido.findMany({
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
        return this.prisma.tenantClient.subitem.findFirst({
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
        return this.prisma.tenantClient.estoquePosicao.updateMany({
            where: { subitem_id: dto.subitem_id },
            data: { quantidade_fisica: tipoCalculo }
        })
    }

    async alterarStatusDelivery(pedidoId: string, dto: AlterarDeliveryStatusDto) {
        return this.prisma.tenantClient.pedido.update({
            where: { id: pedidoId },
            data: {
                delivery_status: dto.status,
                motoboy_id: dto.motoboy_id !== undefined ? (dto.motoboy_id ?? null) : undefined,
            },
        })
    }

    // ─────────────────────────────────────────────────────── COMANDA

    async criarComanda(data: CriarComandaDto) {
        return this.prisma.tenantClient.comanda.create({
            data: { nome: data.nome ?? null },
        })
    }

    async listarComandasAtivas() {
        return this.prisma.tenantClient.comanda.findMany({
            where: { status: { in: ['OCUPADA', 'CONTA'] } },
        })
    }

    async cancelarComanda(id: string) {
        const empresaId = Number(this.tenant.empresaId)
        return this.prisma.$transaction(async (tx) => {
            await tx.pedido.updateMany({
                where: { comanda_id: id, empresa_id: empresaId, status: 'PENDENTE' },
                data: { status: 'CANCELADA', comanda_id: null },
            })
            return tx.comanda.delete({
                where: { id: id },
            })
        })
    }










    
}

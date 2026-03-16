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
        if (data.mesa) {
            await this.movimentarEstoque("mesa", data.mesa)
            //
            await this.prisma.tenantClient.pedido.updateMany({ where: { mesa_id: data.mesa }, data: { status: "PAGA", mesa_id: null, comanda_id: null, senha_id: null, formato: "MESA" } })
            return await this.mesa.setStatus(data.mesa!, "LIVRE")
        }
        if (data.comanda) {
            await this.movimentarEstoque("comanda", data.comanda)
            //
            await this.prisma.tenantClient.pedido.updateMany({ where: { comanda_id: data.comanda }, data: { status: "PAGA", mesa_id: null, comanda_id: null, senha_id: null, formato: "COMANDA" } })
            return await this.comanda.setStatus(data.comanda!, "PAGA")
        }
        if (data.senha != undefined) {
            await this.movimentarEstoque("senha", data.senha)
            //
            await this.prisma.tenantClient.pedido.updateMany({ where: { senha_id: data.senha }, data: { status: "PAGA", mesa_id: null, comanda_id: null, senha_id: null, formato: "SENHA" } })
            return await this.senha.delete(data.senha)
        }
        
        throw new BadRequestException("Param da query precisa ser informado com o id de um dos formatos: mesa | comanda | senha ")
    }



    
    async movimentarEstoque(formato: "mesa" | "comanda" | "senha", formato_id: string | number) {
        let where = { }
        if (formato == "mesa") {
           where = { mesa_id: formato_id as string } 
        }
        if (formato == "comanda") {
           where = { comanda_id: formato_id as string } 
        }
        if (formato == "senha") {
           where = { senha_id: formato_id as number } 
        }

        const all = await this.prisma.pedido.findMany({ where: where, include: { itens: { include: { subitens: { include: { subitem: true } } } } } })

        const itens = all.map((e) =>  e.itens).flat()
        const subitens = itens.map((e) => e.subitens).flat()
        const subintesEstoque = subitens.filter(e => e.subitem.controla_estoque)

        const estoque = subintesEstoque.map((e) => ({
            subitem_id: e.subitem_id,
            quantidade: Number(e.quantidade),
            tipo: EstoqueMovimentacaoTipo.SAIDA
        }))

        await this.estoque.salvarVarios(estoque)
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






    
}

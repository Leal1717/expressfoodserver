import { BadRequestException, Injectable } from '@nestjs/common';
import { Classe, Item, ItemTipo, PedidoStatus  } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePedidoDto, PedidoQueryDto } from './dto';


/**
        enum PedidoStatus {
            PENDENTE
            PAGA
            CANCELADA
        }
 */

@Injectable()
export class PedidosService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data: CreatePedidoDto) {
        return this.prisma.pedido.create({
            data: {
                total: data.total,
                desconto: data.desconto,
                status: data.status ?? 'PENDENTE',

                empresa_id: 1,
                usuario_id: data.usuario_id,

                mesa_id: data.mesa_id,
                comanda_id: data.comanda_id,
                senha_id: data.senha_id,

                itens: {
                    create: data.itens.map(i => ({
                        item_id: i.item_id,
                        quantidade: i.quantidade,
                        preco: i.preco,
                        desconto: i.desconto,
                        subitens: {
                            create: i.subitens?.map(s => ({
                                subitem_id: s.subitem_id,
                                quantidade: s.quantidade,
                                preco: s.preco,
                                desconto: s.desconto
                            }))
                        }
                    }))
                }
            },
            include: {
                itens: { include: { subitens: true, item: true } }
            }
        });
    }



    async alterarStatus(id:string, status: PedidoStatus) {
        return this.prisma.tenantClient.pedido.update({where: {id: id}, data: {status: status}})
    }
    




    async buscarTodos() {
        return this.prisma.tenantClient.pedido.findMany()
    }




    async buscarPorId(id: number) {
        return this.prisma.tenantClient.pedido.findUnique({where: {id: Number(id)}})
    }




    async buscarPorFormato(tipo:string, id?: string | number) {
        if (tipo == "mesa") {
            if (id) {
                return this.prisma.tenantClient.pedido.findMany({ where: {  mesa_id: Number(id) } })
            }
            return this.prisma.tenantClient.pedido.findMany({ where: { NOT: { mesa_id: null }} })
        }
        if (tipo == "comanda") {
            if (id) {
                return this.prisma.tenantClient.pedido.findMany({ where: {  comanda_id: id as string } })
            }
            return this.prisma.tenantClient.pedido.findMany({ where: { NOT: { comanda_id: null }} })
        }
        if (tipo == "senha") {
            if (id) {
                return this.prisma.tenantClient.pedido.findMany({ where: {  senha_id: id as string } })
            }
            return this.prisma.tenantClient.pedido.findMany({ where: { NOT: { senha_id: null }} })
        }
        throw new BadRequestException("Param da query 'tipo' precisa ser informado com: mesa | comanda | senha")
    }



    async buscarQuery(query: PedidoQueryDto) {
        const tipos = [query.mesa, query.comanda, query.senha]
        const indefinidos = tipos.filter(e => !e)
        if (indefinidos.length < 2) {
            throw new BadRequestException("Mais de um formato foi dado (mesa, comanda, senha). Apenas um desses pode vir nao nulo.")
        }

        return this.prisma.pedido.findMany({
            where: {
                usuario_id: query.usuario ? Number(query.usuario) : undefined,
                status: query.status,
                mesa_id: query.mesa ? Number(query.mesa) : undefined,
                comanda_id: query.comanda,
                senha_id: query.senha,
            },
            include: {
                itens: {
                    include: {
                        subitens: {
                            include: { subitem:true }
                        },
                        
                    }
                }
            }
        })
    }


    
}

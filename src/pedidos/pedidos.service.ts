import { BadRequestException, Injectable } from '@nestjs/common';
import { Classe, Item, ItemTipo, PedidoStatus  } from '@prisma/client';
import { CreatePedidoDto } from 'src/operacional/dto';
import { PrismaService } from 'src/prisma/prisma.service';


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
        return this.prisma.tenantClient.pedido.create({
            data: {
                total: data.total,
                desconto: data.desconto,
                status: data.status ?? 'PENDENTE',

                // empresa_id: 1,
                usuario_id: data.usuario_id,

                terminal_id: data.terminal_id,

                observacao: data.observacao,

                mesa_id: data.mesa_id,
                comanda_id: data.comanda_id,
                senha_id: data.senha_id,

                itens: {
                    create: data.itens.map(i => ({
                        item_id: i.item_id,
                        quantidade: i.quantidade,
                        preco: i.preco,
                        desconto: i.desconto,
                        observacao: i.observacao,
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
                itens: { include: { subitens: true, item: true } },
                senha: true,
                mesa: true,
                comanda: true
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






    
}

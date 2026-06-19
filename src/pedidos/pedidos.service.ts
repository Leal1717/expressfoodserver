import { BadRequestException, Injectable } from '@nestjs/common';
import { Classe, Item, ItemTipo, PedidoFormato, PedidoStatus  } from '@prisma/client';
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
        if (data.pedido_uuid) {
            const existente = await this.prisma.tenantClient.pedido.findUnique({
                where: { pedido_uuid: data.pedido_uuid },
                include: { itens: { include: { subitens: true, item: true } }, senha: true, mesa: true, comanda: true },
            })
            if (existente) return existente
        }

        let formato: PedidoFormato;
        if (data.mesa_id)                              formato = 'MESA';
        else if (data.comanda_id)                      formato = 'COMANDA';
        else if (data.senha_id || data.criar_senha)    formato = 'SENHA';
        else if (data.canal_origem || data.cliente_id) formato = 'DELIVERY';
        else                                           formato = 'BALCAO';

        return this.prisma.tenantClient.pedido.create({
            data: {
                total: data.total,
                desconto: data.desconto,
                status: data.status ?? 'PENDENTE',
                formato,

                usuario_id: data.usuario_id,
                terminal_id: data.terminal_id,
                observacao: data.observacao,
                pedido_uuid: data.pedido_uuid,

                mesa_id: data.mesa_id,
                comanda_id: data.comanda_id,
                senha_id: data.senha_id,

                cpf_nota: data.cpf_nota,

                // Delivery
                cliente_id: data.cliente_id,
                canal_origem: data.canal_origem,
                taxa_entrega: data.taxa_entrega,
                endereco_entrega_id: data.endereco_entrega_id,
                zona_entrega_id: data.zona_entrega_id,
                motoboy_id: data.motoboy_id,
                delivery_status: data.canal_origem ? 'CONFIRMADO' : undefined,

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
                                tipo: s.tipo,
                                removido: s.removido ?? false,
                                quantidade: s.quantidade,
                                preco: s.preco,
                                desconto: s.desconto,
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
    




    async buscarTodos(page = 1, limit = 50) {
        const skip = (page - 1) * limit
        const [items, total] = await Promise.all([
            this.prisma.tenantClient.pedido.findMany({ skip, take: limit, orderBy: { created_at: 'desc' } }),
            this.prisma.tenantClient.pedido.count(),
        ])
        return { items, total, page, limit }
    }




    async buscarPorId(id: number) {
        return this.prisma.tenantClient.pedido.findUnique({where: {id: Number(id)}})
    }






    
}

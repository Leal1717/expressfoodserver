import { Injectable } from '@nestjs/common';
import { Classe, Item, ItemTipo, VendaStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVendaDto } from './dto';

@Injectable()
export class VendasService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data: CreateVendaDto) {
        return this.prisma.venda.create({
            data: {
                total: data.total,
                desconto: data.desconto,
                status: data.status ?? 'PENDENTE',

                empresa_id: data.empresa_id,
                usuario_id: data.usuario_id,

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

    async buscarTodos() {
        return this.prisma.venda.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.venda.findUnique({where: {id: Number(id)}})
    }

    async alterarStatus(id:number, status: VendaStatus) {
        return this.prisma.venda.update({where: {id: Number(id)}, data: {status: status}})
    }
    
}

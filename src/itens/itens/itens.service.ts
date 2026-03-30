import { Injectable } from '@nestjs/common';
import { Classe, Item, ItemTipo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Injectable()
export class ItensService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data:CreateItemDto) {
        let tipo: ItemTipo = 'PRODUTO'
        if (!data.subitens || data.subitens.length == 0) {
            tipo = 'MERCADORIA'
        }
        if (data.combo_itens && data.combo_itens.length > 0) {
            tipo = 'COMBO'
        }
        return this.prisma.tenantClient.item.create({
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,

                tipo: tipo,

                classe_id: data.classe_id,

                subitens: {
                    create: data.subitens
                },

                // itens do combo
                combos_as_combo: data.combo_itens
                    ? { create: data.combo_itens.map(ci => ({item_id: ci.item_id, quantidade: ci.quantidade})) }
                    : undefined

            },
            include: {
                subitens: true,
                combos_as_combo: { include: { item: true } },
            }
        })
    }


    async update(data:UpdateItemDto) {
        let tipo: ItemTipo = 'PRODUTO'
        if (!data.subitens || data.subitens.length == 0) {
            tipo = 'MERCADORIA'
        }
        if (data.combo_itens && data.combo_itens.length > 0) {
            tipo = 'COMBO'
        }
        console.log("tipo: ", tipo)
        return this.prisma.tenantClient.item.update({
            where: {id: Number(data.id)},
            data: {
                nome: data.nome,
                descricao: data.descricao,
                preco: data.preco,

                classe_id: data.classe_id,

                tipo: tipo,

                subitens: {
                    deleteMany: {},
                    create: data.subitens
                },

                
                // itens do combo
                combos_as_combo: data.combo_itens
                    ? { deleteMany: {}, create: data.combo_itens.map(ci => ({item_id: ci.item_id, quantidade: ci.quantidade})) }
                    : undefined
            },            
            include: {
                subitens: true,
                combos_as_combo: { include: { item: true } }
            }
        })
    }

        
    async updateAtivo(id: number) {
        return this.prisma.$queryRaw`UPDATE Item SET ativo = NOT ativo WHERE id = ${id}`
    }

    async buscarTodos() {
        return this.prisma.tenantClient.item.findMany({include: { classe: true }})
    }

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.item.findUnique({
            where: {id: Number(id)},
            include: {
                subitens: true,
                combos_as_combo: { include: { item: true } }
            }
        })
    }

    async delete(id:number) {
        return this.prisma.tenantClient.item.delete({where: {id: Number(id)}})
    }




    /**
     * reordena este item e ja reordena todos os outros itens baseado no INDEX
     */
    async reorderTask(id: number, newIndex: number) {
        // 1. Buscar o item atual para saber a posição antiga
        const taskToMove = await this.prisma.tenantClient.item.findUnique({ where: { id } });
        if (taskToMove) {

            const oldIndex = taskToMove.index;
                
            if (oldIndex === newIndex) return taskToMove;

            return this.prisma.tenantClient.itemaction(async (tx) => {
                if (newIndex > oldIndex) {
                    // Movendo para baixo: decrementa quem está no caminho
                    await tx.item.updateMany({
                        where: {index: { gt: oldIndex, lte: newIndex },},
                        data: { index: { decrement: 1 } },
                    });
                } else {
                    // Movendo para cima: incrementa quem está no caminho
                    await tx.item.updateMany({
                        where: {index: { gte: newIndex, lt: oldIndex },},
                        data: { index: { increment: 1 } },
                    });
                }

                // 2. Atualizar o item movido para a posição final
                return tx.item.update({
                    where: { id },
                    data: { index: newIndex },
                });
            });
        }
    }
    
}

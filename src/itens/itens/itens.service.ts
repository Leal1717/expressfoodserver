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
        return this.prisma.$queryRaw`UPDATE item SET ativo = NOT ativo WHERE id = ${id}`
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
    
}

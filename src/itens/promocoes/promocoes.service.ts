
import { BadRequestException, Injectable } from '@nestjs/common';
import { Promocao } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromocoesService {
    constructor(private prisma: PrismaService) {}

    async salvar(data: Promocao) {
        if (data.hora_fim < data.hora_inicio) {
            throw new BadRequestException("Hora fim não pode ser anterior à hora início")
        }
        const promocoesDesteItem = await this.prisma.promocao.findMany({where: {item_id: data.item_id}})
        for (const promo of promocoesDesteItem) {
            if (promo.dia_da_semana_id == data.dia_da_semana_id) {
                throw new BadRequestException("O sistema não permite duas promoções para um mesmo item no mesmo dia da semana")
            }
        }
        return this.prisma.tenantClient.promocao.create({data: data})
    }
    
    async update(data: Promocao) {
        if (data.ativo) {
            const promocoesDesteItem = await this.prisma.promocao.findMany({where: {item_id: data.item_id}})
            for (const promo of promocoesDesteItem) {
                if (promo.dia_da_semana_id == data.dia_da_semana_id && promo.ativo) {
                    throw new BadRequestException("O sistema não permite duas promoções ativas para um mesmo item no mesmo dia da semana")
                }
            }
        }
        return this.prisma.tenantClient.promocao.update({data: data, where: {id: Number(data.id)}})
    }
    

    async buscarTodos() {
        return this.prisma.tenantClient.promocao.findMany()
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.promocao.findUnique({where: {id:id}})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.promocao.delete({where: {id:id}})
    }

}


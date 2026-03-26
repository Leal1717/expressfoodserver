
import { BadRequestException, Injectable } from '@nestjs/common';
import { Promocao } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PromocoesService {
    constructor(private prisma: PrismaService) {}


    private async checagensAntesDeSalvar(element: Promocao) {
        // 1. Validação básica de horário
        if (element.hora_fim <= element.hora_inicio) {
            throw new BadRequestException("A hora de término deve ser maior que a hora de início.");
        }

        // 2. Buscamos todas as promoções do mesmo item que tenham conflito de HORÁRIO
        // Usamos a mesma lógica: (InicioNovo < FimExistente) AND (FimNovo > InicioExistente)
        const promocoesMesmoHorario = await this.prisma.promocao.findMany({
            where: {
                item_id: element.item_id,
                ativo: true, // Só importa se a promoção estiver ativa
                AND: [
                    { hora_inicio: { lt: element.hora_fim } },
                    { hora_fim: { gt: element.hora_inicio } },
                ],
                NOT: element.id ? { id: element.id } : undefined,
            },
        });

        // 3. Definimos os dias que queremos validar
        const diasDaSemana = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'] as const;

        // 4. Checamos se há conflito em algum dia marcado como true
        for (const promoExistente of promocoesMesmoHorario) {
            // Verificamos se existe algum dia que é 'true' em AMBOS os objetos
            const diaConflitante = diasDaSemana.find((dia) => element[dia] === true && promoExistente[dia] === true);

            if (diaConflitante) {throw new BadRequestException(`Conflito! O item já tem promoção ativa na ${diaConflitante.toUpperCase()} das ${promoExistente.hora_inicio} às ${promoExistente.hora_fim}.`);}
        }


    }

   

    async salvar(data: Promocao) {
        await this.checagensAntesDeSalvar(data)
        return this.prisma.tenantClient.promocao.create({data: data})
    }

    
    async update(data: Promocao) {
        await this.checagensAntesDeSalvar(data)
        return this.prisma.tenantClient.promocao.update({data: data, where: {id: Number(data.id)}})
    }   
    
    async updateAtivo(id:number) {
        return this.prisma.$queryRaw`UPDATE Promocao SET ativo = NOT ativo WHERE id = ${id}`
    }   

    async buscarTodos() {
        return this.prisma.tenantClient.promocao.findMany({ include: { item: true } })
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.promocao.findUnique({where: {id:id,  include: { item: true }}})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.promocao.delete({where: {id:id}})
    }

}


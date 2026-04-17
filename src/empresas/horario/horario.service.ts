/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { HorarioDeFuncionamento, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HorarioService {
    constructor (private prisma: PrismaService) {}


    
    /** 
     * aqui chamamos de SYNC pq ele faz create, update e delete. Ele pega a lista toda e reatualiza tudo no banco 
     */
    async sync(data: HorarioDeFuncionamento[]) {
        try {
            const dbHorarios = await this.prisma.tenantClient.horarioDeFuncionamento.findMany()
            const idsRecebidos = data.filter(h => h.id).map(h => h.id)

            //
            // 🔹 DELETE (o que existe no banco mas não veio)
            //
            const deletar = dbHorarios
                .filter(db => !idsRecebidos.includes(db.id))
                .map(db =>this.prisma.tenantClient.horarioDeFuncionamento.delete({where: { id: db.id }}))

            //
            // 🔹 UPDATE (tem id)
            //
            const atualizar = data
                .filter(h => h.id)
                .map(h =>
                    this.prisma.tenantClient.horarioDeFuncionamento.update({
                        where: { id: h.id },
                        data: {
                            dia_id: h.dia_id,
                            hora_abertura: h.hora_abertura,
                            hora_fechamento: h.hora_fechamento
                        }
                    })
                )

            //
            // 🔹 CREATE (não tem id)
            //
            const criar = data
                .filter(h => !h.id)
                .map(h =>
                    this.prisma.tenantClient.horarioDeFuncionamento.create({
                        data: {
                            dia_id: h.dia_id,
                            hora_abertura: h.hora_abertura,
                            hora_fechamento: h.hora_fechamento,
                            empresa_id: h.empresa_id // importante se necessário
                        }
                    })
                )

            //
            // 🔥 TRANSACTION
            //
            return await this.prisma.tenantClient.$transaction([
                ...deletar,
                ...atualizar,
                ...criar
            ])

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new BadRequestException(`Valor único duplicado: ${error.meta?.target}`)
            }
            throw error
        }
    }
    



    async buscarTodos() {
        return this.prisma.tenantClient.horarioDeFuncionamento.findMany({include: { dia: true }})
    }

    async buscarTodosPorDia() {
        const dados = await this.prisma.tenantClient.horarioDeFuncionamento.findMany({include: { dia: true }})

        const agrupado = Object.values(
            dados.reduce((acc, item) => {
                const diaId = item.dia.id

                if (!acc[diaId]) {
                    acc[diaId] = {
                        id: item.dia.id,
                        nome_completo: item.dia.nome_completo,
                        nome_abreviado: item.dia.nome_abreviado,
                        nome_enum: item.dia.nome_enum,
                        horarios: []
                    }
                }

                acc[diaId].horarios.push({
                    id: item.id,
                    dia_id: item.dia_id,
                    hora_abertura: item.hora_abertura,
                    hora_fechamento: item.hora_fechamento,
                    empresa_id: item.empresa_id,
                })

                return acc
            }, {} as Record<number, any>)
        )

        return agrupado
    }


    async delete(id:number) {
        return this.prisma.tenantClient.horarioDeFuncionamento.delete({ where: { id: id } })
    }


}

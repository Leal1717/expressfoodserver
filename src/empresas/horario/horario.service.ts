/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { HorarioDeFuncionamento, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HorarioService {
    constructor (private prisma: PrismaService) {}
    

    async create(data: HorarioDeFuncionamento[]) {
        try {
            const hroarios = await  this.prisma.tenantClient.horarioDeFuncionamento.createMany({ data: data })
            return hroarios
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new BadRequestException(`Valor único duplicado: ${error.meta?.target}`)
            }
            throw error
        }
        // const dados : HorarioDeFuncionamento[] = []
        // await this.prisma.horarioDeFuncionamento.createMany({data: dados})
    }


    async update(data: HorarioDeFuncionamento[]) {
        const updates = data.map(e => {
            return this.prisma.tenantClient.horarioDeFuncionamento.update({
                where: { id: e.id },
                data: { hora_abertura: e.hora_abertura, hora_fechamento: e.hora_fechamento } 
            })
        })
        return this.prisma.tenantClient.$transaction(updates)
    }


    async buscarTodos() {
        console.log("Asd")
        return this.prisma.tenantClient.horarioDeFuncionamento.findMany({include: { dia: true }})
    }


    async delete(id:number) {
        return this.prisma.tenantClient.horarioDeFuncionamento.delete({ where: { id: id } })
    }


}

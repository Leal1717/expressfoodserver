/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { HorarioDeFuncionamento } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HorarioService {
    constructor (private prisma: PrismaService) {}
    
    async create(data: HorarioDeFuncionamento) {
        return this.prisma.tenantClient.horarioDeFuncionamento.create({ data: data })
    }


    async update(data: HorarioDeFuncionamento) {
        return this.prisma.tenantClient.horarioDeFuncionamento.update({ where: { id: data.id }, data: data })
    }


    async buscarTodos() {
        return this.prisma.tenantClient.horarioDeFuncionamento.findMany()
    }


    async delete(id:number) {
        return this.prisma.tenantClient.horarioDeFuncionamento.delete({ where: { id: id } })
    }


}

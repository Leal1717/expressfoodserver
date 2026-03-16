import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { PlanoEntity } from './planos.entity';
import { Repository } from 'typeorm';
import { PrismaService } from 'src/prisma/prisma.service';
import {  Terminal } from '@prisma/client';

@Injectable()
export class TerminaisService {
    
    constructor(private prisma: PrismaService) {}

    async salvar(data:Terminal) {
        return await this.prisma.tenantClient.terminal.create({data: data})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.terminal.findMany()
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.terminal.findUnique({where: {id: Number(id)}})
    }

    async update(data:Terminal) {
        return this.prisma.tenantClient.terminal.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.terminal.delete({where: {id: id}})
    }
}

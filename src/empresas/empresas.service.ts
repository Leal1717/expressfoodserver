
import { Injectable } from '@nestjs/common';
import { Empresa, PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmpresasService { 
    constructor(private prisma: PrismaService) {}

    async salvar(data:Empresa) {
        return this.prisma.empresa.create({data:data})
    }
    async buscarTodos() {
        return this.prisma.empresa.findMany()
    }
    async buscarPorId(id: number) {
        return this.prisma.empresa.findUnique({where: {id: Number(id)}, include: {plano: true}})
    }
    async update(data:Empresa) {
        return this.prisma.empresa.update({where: {id: Number(data.id)}, data: data})
    }
}

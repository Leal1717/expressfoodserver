import { Injectable } from '@nestjs/common';
import { Mesa } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MesasService {
    constructor(private prisma: PrismaService) {}

    async salvar(data:Mesa) {
        return await this.prisma.tenantClient.mesa.create({data: data})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.mesa.findMany()
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.mesa.findUnique({where: {id: Number(id)}})
    }

    async update(data:Mesa) {
        return this.prisma.tenantClient.mesa.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.mesa.delete({where: {id: Number(id)}})
    }
}

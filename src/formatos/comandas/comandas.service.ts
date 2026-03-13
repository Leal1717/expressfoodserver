import { Injectable } from '@nestjs/common';
import { Comanda, ComandaStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComandasService {
    constructor(private prisma: PrismaService) {}

    async salvar(data:Comanda) {
        return await this.prisma.tenantClient.comanda.create({data: data})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.comanda.findMany()
    }

    async buscarPorId(id:string) {
        return this.prisma.tenantClient.comanda.findUnique({where: {id: id}})
    }

    async update(data:Comanda) {
        return this.prisma.tenantClient.comanda.update({where: {id: data.id}, data: data})
    }

    async delete(id:string) {
        return this.prisma.tenantClient.comanda.delete({where: {id: id}})
    }

    // ------------------------------------------------------------------------------ status
    async setStatus(id: string, status: ComandaStatus) {
        return this.prisma.tenantClient.comanda.update({where: {id: id}, data: {status: status} })
    }
}

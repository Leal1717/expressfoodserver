import { Injectable } from '@nestjs/common';
import { Senha } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SenhasService {
    constructor(private prisma: PrismaService) {}

    async salvar(data:Senha) {
        return await this.prisma.tenantClient.senha.create({data: data})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.senha.findMany()
    }

    async buscarPorId(id:string) {
        return this.prisma.tenantClient.senha.findUnique({where: {id: id}})
    }

    async update(data:Senha) {
        return this.prisma.tenantClient.senha.update({where: {id: data.id}, data: data})
    }

    async delete(id:string) {
        return this.prisma.tenantClient.senha.delete({where: {id: id}})
    }
}

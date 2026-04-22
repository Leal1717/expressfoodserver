import { Injectable } from '@nestjs/common';
import { Senha } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SenhasService {
    constructor(private prisma: PrismaService) {}

    async salvar(data:Senha) {
        return await this.prisma.tenantClient.senha.create({data: data})
    }

    async criarSenhaOrdem() : Promise<Senha> {
        const max = await this.prisma.tenantClient.senha.aggregate({ _max: { numero: true } })
        const numero = (max._max.numero ?? 0) + 1
        return await this.prisma.tenantClient.senha.create({ data: { nome: `${numero}`, numero: numero } })
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

    async delete(numero: number) {
        return this.prisma.tenantClient.senha.deleteMany({where: {numero: Number(numero)}})
    }

    // ------------------------------------------------------------------------------ status

}

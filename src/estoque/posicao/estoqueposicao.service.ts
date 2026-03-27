import { Injectable } from '@nestjs/common';
import { EstoquePosicao } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstoqueposicaoService { 
    constructor(private prisma: PrismaService) {}

        
    async salvar(data: EstoquePosicao) {
        return this.prisma.tenantClient.estoquePosicao.create({data: data})
    }
    async update(data: EstoquePosicao) {
        return this.prisma.tenantClient.estoquePosicao.update({data: data, where: { id: data.id }})
    }
    async buscarTodos() {
        return this.prisma.tenantClient.estoquePosicao.findMany({ include: { subitem: { select: { nome:true } } } })
    }
    async buscarPorId(id: number) {
        return this.prisma.tenantClient.estoquePosicao.findUnique({ where: { id: id } })
    }
    async delete(id: number) {
        return this.prisma.tenantClient.estoquePosicao.delete({ where: { id: id } })
    }
}

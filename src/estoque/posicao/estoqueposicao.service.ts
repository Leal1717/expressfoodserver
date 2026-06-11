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
    async buscarTodos(page = 1, limit = 100) {
        const skip = (page - 1) * limit
        const [items, total] = await Promise.all([
            this.prisma.tenantClient.estoquePosicao.findMany({
                skip, take: limit,
                include: { subitem: { select: { nome: true } } },
                orderBy: { id: 'asc' },
            }),
            this.prisma.tenantClient.estoquePosicao.count(),
        ])
        return { items, total, page, limit }
    }
    async buscarPorId(id: number) {
        return this.prisma.tenantClient.estoquePosicao.findUnique({ where: { id: id } })
    }
    async delete(id: number) {
        return this.prisma.tenantClient.estoquePosicao.delete({ where: { id: id } })
    }
}

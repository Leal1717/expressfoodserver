import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IsNumberOptions } from 'class-validator';


@Injectable()
export class FormasPagamentoService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        const existing = await this.prisma.tenantClient.empresaFormaPagamento.findMany({
            orderBy: { id: 'asc' },
            include: { forma_pagamento: true },
        });

        if (existing.length === 0) {
            const globais = await this.prisma.formaPagamentoGlobal.findMany();
            await this.prisma.tenantClient.empresaFormaPagamento.createMany({
                data: globais.map(f => ({ forma_pagamento_id: f.id, ativo: true })),
                skipDuplicates: true,
            });
            return this.prisma.tenantClient.empresaFormaPagamento.findMany({
                orderBy: { id: 'asc' },
                include: { forma_pagamento: true },
            });
        }

        return existing;
    }

    findOne(id: number) {
        return this.prisma.empresaFormaPagamento.findFirst({where: { id },include: { forma_pagamento: true }});
    }

    async updateAtivo(id: number) {
        const record = await this.prisma.empresaFormaPagamento.findUniqueOrThrow({ where: { id }, select: { ativo: true } })
        return this.prisma.empresaFormaPagamento.update({ where: { id }, data: { ativo: !record.ativo } })
    }


}
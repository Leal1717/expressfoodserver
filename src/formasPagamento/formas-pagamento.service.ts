import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IsNumberOptions } from 'class-validator';


@Injectable()
export class FormasPagamentoService {
    constructor(private prisma: PrismaService) {}

    findAll() {
        return this.prisma.empresaFormaPagamento.findMany({
            orderBy: { id: 'asc' },
            include: { forma_pagamento: true }
        });
    }

    findOne(id: number) {
        return this.prisma.empresaFormaPagamento.findFirst({where: { id },include: { forma_pagamento: true }});
    }

    async updateAtivo(id: number) {
        const record = await this.prisma.empresaFormaPagamento.findUniqueOrThrow({ where: { id }, select: { ativo: true } })
        return this.prisma.empresaFormaPagamento.update({ where: { id }, data: { ativo: !record.ativo } })
    }


}
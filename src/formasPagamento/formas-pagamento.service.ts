import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFormaPagamentoDto, UpdateFormaPagamentoDto } from './dtos/formas-pagamento-dto';


@Injectable()
export class FormasPagamentoService {
    constructor(private prisma: PrismaService) {}

    create(data: CreateFormaPagamentoDto) {
        return this.prisma.tenantClient.formaPagamento.create({
        data,
        });
    }

    findAll() {
        return this.prisma.tenantClient.formaPagamento.findMany({
        orderBy: { id: 'asc' },
        });
    }

    findOne(id: number) {
        return this.prisma.tenantClient.formaPagamento.findFirst({
        where: { id },
        });
    }

    update(id: number, data: UpdateFormaPagamentoDto) {
        return this.prisma.tenantClient.formaPagamento.update({
        where: { id },
        data,
        });
    }

    remove(id: number) {
        return this.prisma.tenantClient.formaPagamento.update({
        where: { id },
        data: { ativo: false },
        });
    }
}
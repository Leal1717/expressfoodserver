import { Injectable } from '@nestjs/common';
import { ProducaoStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KdsService {
    constructor(private prisma: PrismaService) {}

    buscarPedidos() {
        return this.prisma.tenantClient.pedido.findMany({
            where: {
                status: 'PENDENTE',
                producao_status: { not: 'PRONTO' },
            },
            orderBy: { created_at: 'asc' },
            include: {
                itens: {
                    include: {
                        item: { select: { id: true, nome: true } },
                        subitens: {
                            include: { subitem: { select: { id: true, nome: true } } },
                        },
                    },
                },
                mesa: { select: { nome: true } },
                comanda: { select: { nome: true } },
                senha: { select: { numero: true } },
            },
        })
    }

    atualizarStatus(id: string, status: ProducaoStatus) {
        return this.prisma.tenantClient.pedido.update({
            where: { id },
            data: { producao_status: status },
        })
    }
}

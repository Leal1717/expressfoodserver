import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtualizarMotoboyDto, CriarMotoboyDto } from './dto';

@Injectable()
export class MotoboyService {
    constructor(private prisma: PrismaService) {}

    create(data: CriarMotoboyDto) {
        return this.prisma.tenantClient.motoboy.create({ data });
    }

    findAll() {
        return this.prisma.tenantClient.motoboy.findMany({
            include: {
                _count: { select: { pedidos: true } },
                usuario: { select: { id: true, nome: true, email: true } },
            },
            orderBy: { nome: 'asc' },
        });
    }

    findOne(id: number) {
        return this.prisma.tenantClient.motoboy.findUnique({
            where: { id },
        });
    }

    update(data: AtualizarMotoboyDto) {
        const { id, ...rest } = data;
        return this.prisma.tenantClient.motoboy.update({
            where: { id },
            data: rest,
        });
    }

    remove(id: number) {
        return this.prisma.tenantClient.motoboy.delete({ where: { id } });
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtualizarZonaEntregaDto, CriarZonaEntregaDto } from './dto';

@Injectable()
export class ZonasEntregaService {
    constructor(private prisma: PrismaService) {}

    create(data: CriarZonaEntregaDto) {
        return this.prisma.tenantClient.zonaEntrega.create({ data });
    }

    findAll() {
        return this.prisma.tenantClient.zonaEntrega.findMany({
            orderBy: { nome: 'asc' },
        });
    }

    findOne(id: number) {
        return this.prisma.tenantClient.zonaEntrega.findUnique({
            where: { id },
        });
    }

    update(data: AtualizarZonaEntregaDto) {
        const { id, ...rest } = data;
        return this.prisma.tenantClient.zonaEntrega.update({
            where: { id },
            data: rest,
        });
    }

    remove(id: number) {
        return this.prisma.tenantClient.zonaEntrega.delete({ where: { id } });
    }
}

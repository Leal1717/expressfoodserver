import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AtualizarGrupoFiscalDto, CriarGrupoFiscalDto } from './dto';

@Injectable()
export class GruposfiscaisService {
    constructor(private prisma: PrismaService) {}

    create(data: CriarGrupoFiscalDto) {
        return this.prisma.tenantClient.grupoFiscal.create({ data });
    }

    findAll() {
        return this.prisma.tenantClient.grupoFiscal.findMany({
            include: { _count: { select: { itens: true } } },
            orderBy: { nome: 'asc' },
        });
    }

    findOne(id: number) {
        return this.prisma.tenantClient.grupoFiscal.findUnique({
            where: { id },
            include: { itens: { select: { id: true, nome: true } } },
        });
    }

    update(data: AtualizarGrupoFiscalDto) {
        const { id, ...rest } = data;
        return this.prisma.tenantClient.grupoFiscal.update({
            where: { id },
            data: rest,
        });
    }

    remove(id: number) {
        return this.prisma.tenantClient.grupoFiscal.delete({ where: { id } });
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';
import { AtualizarZonaEntregaDto, CriarZonaEntregaDto, ImportarZonasDto } from './dto';

@Injectable()
export class ZonasEntregaService {
    constructor(
        private prisma: PrismaService,
        private tenant: TenantService,
    ) {}

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

    atualizarTaxaBase(taxa_base: number) {
        return this.prisma.tenantClient.zonaEntrega.updateMany({
            data: { taxa_base },
        });
    }

    async importar(dto: ImportarZonasDto) {
        const empresaId = Number(this.tenant.empresaId);
        const taxaBase = dto.taxa_base ?? 0;
        const cidadePadrao = dto.cidade ?? '';
        const results = await Promise.all(
            dto.zonas.map(zona => {
                const taxaBaseEfetiva = zona.taxa_base ?? taxaBase;
                const cidade = zona.cidade ?? cidadePadrao;
                return this.prisma.zonaEntrega.upsert({
                    where: { nome_cidade_empresa_id: { nome: zona.nome, cidade, empresa_id: empresaId } },
                    create: { nome: zona.nome, cidade, taxa_base: taxaBaseEfetiva, taxa: zona.taxa, tempo_estimado: zona.tempo_estimado ?? 30, empresa_id: empresaId },
                    update: { cidade, taxa_base: taxaBaseEfetiva, taxa: zona.taxa, tempo_estimado: zona.tempo_estimado ?? 30 },
                });
            })
        );
        return { count: results.length };
    }
}

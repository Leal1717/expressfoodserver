import { Injectable } from '@nestjs/common';
import { EventoStatus } from '@prisma/client';
import { OciStorageService } from 'src/oci/ocistorage.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';
import { CreateEventoDto, UpdateEventoDto } from './dto';

@Injectable()
export class EventosService {
    constructor(
        private prisma: PrismaService,
        private tenant: TenantService,
        private oci: OciStorageService,
    ) {}

    async salvar(data: CreateEventoDto) {
        return this.prisma.tenantClient.evento.create({
            data: {
                nome: data.nome,
                descricao: data.descricao,
                inicio: new Date(data.inicio),
                final: new Date(data.final),
            },
        });
    }

    async buscarTodos() {
        return this.prisma.tenantClient.evento.findMany({
            orderBy: { inicio: 'desc' },
        });
    }

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.evento.findUnique({
            where: { id: Number(id) },
        });
    }

    async update(data: UpdateEventoDto) {
        return this.prisma.tenantClient.evento.update({
            where: { id: Number(data.id) },
            data: {
                nome: data.nome,
                descricao: data.descricao,
                inicio: new Date(data.inicio),
                final: new Date(data.final),
                status: data.status,
            },
        });
    }

    async updateStatus(id: number, status: EventoStatus) {
        return this.prisma.tenantClient.evento.update({
            where: { id },
            data: { status },
        });
    }

    async delete(id: number) {
        const empresa = await this.prisma.empresa.findUnique({
            where: { id: Number(this.tenant.empresaId) },
            select: { cnpj: true },
        });
        if (empresa) await this.oci.deleteEventoImage(empresa.cnpj, id);
        return this.prisma.tenantClient.evento.delete({ where: { id: Number(id) } });
    }
}

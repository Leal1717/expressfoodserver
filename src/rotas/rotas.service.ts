import { BadRequestException, Injectable } from '@nestjs/common'
import { MotivoNaoEntrega, OcorrenciaTipo } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { TenantService } from 'src/tenant/tenant.service'
import { CriarRotaDto } from './dto'

const PEDIDO_INCLUDE = {
    cliente:          { select: { id: true, nome: true, telefone: true } },
    endereco_entrega: { select: { id: true, rua: true, numero: true, bairro: true, cidade: true, estado: true } },
    itens: {
        include: {
            item: true,
            subitens: { include: { subitem: { select: { id: true, nome: true } } } },
        },
    },
}

const ROTA_INCLUDE = {
    motoboy: { select: { id: true, nome: true, telefone: true } },
    pedidos: { include: PEDIDO_INCLUDE },
}

@Injectable()
export class RotasService {
    constructor(
        private prisma: PrismaService,
        private tenant: TenantService,
    ) {}

    async criar(dto: CriarRotaDto) {
        const empresaId = Number(this.tenant.empresaId)
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            const rota = await tx.rota.create({
                data: {
                    motoboy_id: dto.motoboy_id,
                    empresa_id: empresaId,
                    saiu_at: now,
                },
            })

            const updated = await tx.pedido.updateMany({
                where: {
                    id: { in: dto.pedido_ids },
                    empresa_id: empresaId,
                    delivery_status: 'AGUARDANDO_MOTOBOY',
                },
                data: {
                    rota_id: rota.id,
                    motoboy_id: dto.motoboy_id,
                    delivery_status: 'A_CAMINHO',
                    saiu_at: now,
                },
            })

            if (updated.count === 0) {
                throw new BadRequestException('Nenhum pedido válido encontrado para criar a rota. Os pedidos devem estar com status AGUARDANDO_MOTOBOY.')
            }

            return tx.rota.findUnique({ where: { id: rota.id }, include: ROTA_INCLUDE })
        })
    }

    async todos(status?: string) {
        const where: any = { empresa_id: Number(this.tenant.empresaId) }
        if (status) where.status = status

        return this.prisma.tenantClient.rota.findMany({
            where,
            include: ROTA_INCLUDE,
            orderBy: { criado_at: 'desc' },
        })
    }

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.rota.findFirst({
            where: { id, empresa_id: Number(this.tenant.empresaId) },
            include: ROTA_INCLUDE,
        })
    }

    async entregarPedido(rotaId: number, pedidoId: string) {
        const empresaId = Number(this.tenant.empresaId)
        const now = new Date()

        return this.prisma.$transaction(async (tx) => {
            await tx.pedido.update({
                where: { id: pedidoId },
                data: { delivery_status: 'ENTREGUE', entregue_at: now },
            })

            const rota = await tx.rota.findFirst({
                where: { id: rotaId, empresa_id: empresaId },
                include: { pedidos: { select: { id: true, delivery_status: true } } },
            })

            if (!rota) throw new BadRequestException('Rota não encontrada')

            const todosResolvidos = rota.pedidos.every(
                p => p.id === pedidoId || p.delivery_status === 'ENTREGUE' || p.delivery_status === 'NAO_ENTREGUE',
            )

            if (todosResolvidos) {
                await tx.rota.update({ where: { id: rotaId }, data: { status: 'CONCLUIDA', concluido_at: now } })
            }

            return tx.rota.findUnique({ where: { id: rotaId }, include: ROTA_INCLUDE })
        })
    }

    async cancelar(rotaId: number) {
        const empresaId = Number(this.tenant.empresaId)

        return this.prisma.$transaction(async (tx) => {
            await tx.pedido.updateMany({
                where: { rota_id: rotaId, empresa_id: empresaId, delivery_status: 'A_CAMINHO' },
                data: { delivery_status: 'AGUARDANDO_MOTOBOY', rota_id: null, motoboy_id: null, saiu_at: null },
            })

            return tx.rota.update({ where: { id: rotaId }, data: { status: 'CANCELADA' } })
        })
    }

    async minhaRota(usuarioId: number) {
        const empresaId = Number(this.tenant.empresaId)

        const motoboy = await this.prisma.tenantClient.motoboy.findFirst({
            where: { usuario_id: usuarioId },
        })

        if (!motoboy) return null

        return this.prisma.tenantClient.rota.findFirst({
            where: { motoboy_id: motoboy.id, status: 'EM_ANDAMENTO', empresa_id: empresaId },
            include: ROTA_INCLUDE,
        })
    }

    async naoEntregarPedido(rotaId: number, pedidoId: string, motivo: MotivoNaoEntrega) {
        const empresaId = Number(this.tenant.empresaId)

        return this.prisma.$transaction(async (tx) => {
            await tx.pedido.update({
                where: { id: pedidoId },
                data: { delivery_status: 'NAO_ENTREGUE', motivo_nao_entrega: motivo },
            })

            const rota = await tx.rota.findFirst({
                where: { id: rotaId, empresa_id: empresaId },
                include: { pedidos: { select: { id: true, delivery_status: true } } },
            })

            if (!rota) throw new BadRequestException('Rota não encontrada')

            const todosResolvidos = rota.pedidos.every(
                p => p.delivery_status === 'ENTREGUE' || p.delivery_status === 'NAO_ENTREGUE',
            )

            if (todosResolvidos) {
                await tx.rota.update({
                    where: { id: rotaId },
                    data: { status: 'CONCLUIDA', concluido_at: new Date() },
                })
            }

            return tx.rota.findUnique({ where: { id: rotaId }, include: ROTA_INCLUDE })
        })
    }

    async atualizarOcorrencia(rotaId: number, tipo: OcorrenciaTipo | null, descricao?: string) {
        return this.prisma.tenantClient.rota.update({
            where: { id: rotaId },
            data: {
                ocorrencia_tipo: tipo ?? null,
                ocorrencia_descricao: tipo ? (descricao ?? null) : null,
            },
        })
    }
}

import { ConflictException, Injectable } from '@nestjs/common';
import { Comanda, ComandaStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ComandasService {
    constructor(private prisma: PrismaService) {}

    async salvar(data:Comanda) {
        return await this.prisma.tenantClient.comanda.create({data: data})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.comanda.findMany()
    }

    async buscarPorId(id:string) {
        return this.prisma.tenantClient.comanda.findUnique({where: {id: id}})
    }

    async update(data:Comanda) {
        return this.prisma.tenantClient.comanda.update({where: {id: data.id}, data: data})
    }

    async delete(id:string) {
        return this.prisma.tenantClient.comanda.delete({where: {id: id}})
    }

    async abrirEntrada(nome: string, cliente_id?: number) {
        const mesmoNome = await this.prisma.tenantClient.comanda.findFirst({
            where: { nome, status: { in: ['OCUPADA', 'CONTA'] } },
            select: { id: true },
        })
        if (mesmoNome) {
            throw new ConflictException(
                `Já existe uma comanda aberta com o nome/pulseira "${nome}".`
            )
        }

        if (cliente_id) {
            const aberta = await this.prisma.tenantClient.comanda.findFirst({
                where: { cliente_id, status: { in: ['OCUPADA', 'CONTA'] } },
                select: { id: true, nome: true },
            })
            if (aberta) {
                throw new ConflictException(
                    `Este cliente já possui uma comanda aberta: pulseira "${aberta.nome}" (ID: ${aberta.id})`
                )
            }
        }

        return this.prisma.tenantClient.comanda.create({
            data: { nome, cliente_id },
            include: { cliente: true },
        })
    }

    async buscarPorNome(nome: string) {
        return this.prisma.tenantClient.comanda.findFirst({
            where: { nome },
            include: {
                cliente: true,
                pedidos: {
                    where: { status: { not: 'CANCELADA' } },
                    include: {
                        itens: {
                            include: {
                                item: true,
                                subitens: { include: { subitem: { select: { id: true, nome: true } } } },
                            },
                        },
                    },
                },
            },
        })
    }

    // ------------------------------------------------------------------------------ status
    async setStatus(id: string, status: ComandaStatus) {
        return this.prisma.tenantClient.comanda.update({ where: { id: id }, data: { status: status } })
    }
}

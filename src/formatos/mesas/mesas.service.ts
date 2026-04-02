import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Mesa, MesaStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MesaUpdatePosDto } from './dto';

@Injectable()
export class MesasService {
    constructor(private prisma: PrismaService) {}

    async salvar(data:Mesa) {
        return await this.prisma.tenantClient.mesa.create({data: data})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.mesa.findMany()
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.mesa.findUnique({where: {id: Number(id)}})
    }

    async buscarPorNome(nome: string) : Promise<Mesa> {
        return this.prisma.tenantClient.mesa.findFirst({where: {nome: nome}})
    }

    async update(data:Mesa) {
        return this.prisma.tenantClient.mesa.update({where: {id: Number(data.id)}, data: data})
    }

    async updatePosicionamento(data: MesaUpdatePosDto[]) {
        return this.prisma.tenantClient.$transaction(
            data.map((mesa) =>
                this.prisma.tenantClient.mesa.update({
                    where: { id: Number(mesa.id) },
                    data: {pos_x: mesa.pos_x,pos_y: mesa.pos_y,},
                })
            )
        );
    }

    async delete(id:number) {
        const mesa = await this.prisma.mesa.findUnique({ where: {id: Number(id)}})
       if (!mesa) throw new NotFoundException()
        if (mesa!.status !== 'LIVRE') {
            throw new BadRequestException("Essa mesa não pode ser excluída enquanto estiver com o status " + mesa.status)
        }
        return this.prisma.tenantClient.mesa.delete({where: {id: Number(id)}})
    }

    // ------------------------------------------------------------------------------ status
    async setStatus(nome: string, status: MesaStatus) {
        return this.prisma.tenantClient.mesa.updateMany({where: {nome: nome}, data: {status: status} })
    }
}

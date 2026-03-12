import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { PlanoEntity } from './planos.entity';
import { Repository } from 'typeorm';
import { PrismaService } from 'src/prisma/prisma.service';
import { Impressora } from '@prisma/client';

@Injectable()
export class ImpressorasService {
    // constructor(@InjectRepository(PlanoEntity) private repository: Repository<PlanoEntity>) {}
    constructor(private prisma: PrismaService) {}

    async salvar(data:Impressora) {
        return await this.prisma.tenantClient.impressora.create({data: data})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.impressora.findMany()
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.impressora.findUnique({where: {id: Number(id)}})
    }

    async update(data:Impressora) {
        return this.prisma.tenantClient.impressora.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.impressora.delete({where: {id: id}})
    }
}

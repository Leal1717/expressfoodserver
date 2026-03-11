import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { PlanoEntity } from './planos.entity';
import { Repository } from 'typeorm';
import { PrismaService } from 'src/prisma/prisma.service';
import { Plano } from '@prisma/client';

@Injectable()
export class PlanosService {
    // constructor(@InjectRepository(PlanoEntity) private repository: Repository<PlanoEntity>) {}
    constructor(private prisma: PrismaService) {}

    async salvar(data:Plano) {
        const plano = await this.prisma.plano.create({data: data})
        return plano
    }

    async buscarTodos() {
        const plano = this.prisma.plano.findMany()
        return plano
    }

    async buscarPorId(id:number) {
        return this.prisma.plano.findUnique({where: {id: Number(id)}})
    }

    async update(data:Plano) {
        return this.prisma.plano.update({where: {id: Number(data.id)}, data: data})
    }
}

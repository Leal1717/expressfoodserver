import { Injectable } from '@nestjs/common';
import { Classe, Subitem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubitensService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data:Subitem) {
        return this.prisma.subitem.create({data:data})
    }

    async buscarTodos() {
        return this.prisma.subitem.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.subitem.findUnique({where: {id: Number(id)}})
    }

    async update(data:Subitem) {
        return this.prisma.subitem.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.subitem.delete({where: {id: Number(id)}})
    }
    
}

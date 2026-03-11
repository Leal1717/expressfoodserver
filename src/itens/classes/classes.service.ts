import { Injectable } from '@nestjs/common';
import { Classe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data:Classe) {
        return this.prisma.classe.create({data:data})
    }

    async buscarTodos() {
        return this.prisma.classe.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.classe.findUnique({where: {id: Number(id)}})
    }

    async update(data:Classe) {
        return this.prisma.classe.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.classe.delete({where: {id: Number(id)}})
    }
    
}

import { Injectable } from '@nestjs/common';
import { Classe, Subitem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubitensService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data:Subitem) {
        const data2:any = data
        delete data2.empresa_id
        return this.prisma.tenantClient.subitem.create({data:data2})
    }

    async buscarTodos() {
        return this.prisma.tenantClient.subitem.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.subitem.findUnique({where: {id: Number(id)}})
    }

    async update(data:Subitem) {
        return this.prisma.tenantClient.subitem.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.subitem.delete({where: {id: Number(id)}})
    }
    
}

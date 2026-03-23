import { Injectable } from '@nestjs/common';
import { Classe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data:Classe) {
        return this.prisma.tenantClient.classe.create(data)
    }

    async buscarTodos() {
        return this.prisma.tenantClient.classe.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.classe.findUnique({where: {id: Number(id)}})
    }

    async update(data:Classe) {
        return this.prisma.tenantClient.classe.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.classe.delete({where: {id: Number(id)}})
    }
    
}

import { Injectable } from '@nestjs/common';
import { Classe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data:Classe) {
        const data2:any = data
        delete data2.empresa_id
        return this.prisma.tenantClient.classe.create({data:data2})
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

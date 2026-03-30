import { Injectable } from '@nestjs/common';
import { Classe } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class ClassesService {
    constructor(private prisma: PrismaService) {}
    
    async salvar(data:Classe) {
        return this.prisma.tenantClient.classe.create({data: data})
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




    /**
     * reordena este item e ja reordena todos os outros itens baseado no INDEX
     */
    async reorderTask(id: number, newIndex: number) {
        // 1. Buscar o item atual para saber a posição antiga
        const taskToMove = await this.prisma.tenantClient.classe.findUnique({ where: { id } });
        if (taskToMove) {

            const oldIndex = taskToMove.index;
                
            if (oldIndex === newIndex) return taskToMove;

            return this.prisma.tenantClient.$transaction(async (tx) => {
                if (newIndex > oldIndex) {
                    // Movendo para baixo: decrementa quem está no caminho
                    await tx.classe.updateMany({
                        where: {index: { gt: oldIndex, lte: newIndex },},
                        data: { index: { decrement: 1 } },
                    });
                } else {
                    // Movendo para cima: incrementa quem está no caminho
                    await tx.classe.updateMany({
                        where: {index: { gte: newIndex, lt: oldIndex },},
                        data: { index: { increment: 1 } },
                    });
                }

                // 2. Atualizar o item movido para a posição final
                return tx.classe.update({
                    where: { id },
                    data: { index: newIndex },
                });
            });
        }
    }
    
}

import { Injectable } from '@nestjs/common';
import { EstoqueMovimentacao } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MovimentacaoSalvarDto, MovimentacaoUpdateDto } from './dto';

@Injectable()
export class MovimentacaoService { 
    constructor(private prisma: PrismaService) {}

    /**
     * tipo padrao sempre vai ser ENTRADA
     */
    async salvar(data: MovimentacaoSalvarDto) {
        return this.prisma.tenantClient.estoqueMovimentacao.create({ 
            data: {
                quantidade: data.quantidade,
                referencia: data.referencia,
                subitem_id: data.subitem_id,
                tipo: data.tipo,
            } 
        })
    }

    /**
     * tipo padrao sempre vai ser ENTRADA
     */
    async salvarVarios(data: MovimentacaoSalvarDto[]) {
        const dados:any[] = data.map((e) => ({
            quantidade: e.quantidade,
            referencia: e.referencia,
            subitem_id: e.subitem_id,
            tipo: e.tipo,
        }))
        return this.prisma.tenantClient.estoqueMovimentacao.createMany({ 
            data: dados
        })
    }

    
    async update(data: MovimentacaoUpdateDto) {
        return this.prisma.tenantClient.estoqueMovimentacao.update({data: data, where: { id: data.id }})
    }


    async buscarTodos(page = 1, limit = 50) {
        const skip = (page - 1) * limit
        const [items, total] = await Promise.all([
            this.prisma.tenantClient.estoqueMovimentacao.findMany({
                skip, take: limit,
                include: { subitem: true },
                orderBy: { created_at: 'desc' },
            }),
            this.prisma.tenantClient.estoqueMovimentacao.count(),
        ])
        return { items, total, page, limit }
    }


    async buscarPorId(id: string) {
        return this.prisma.tenantClient.estoqueMovimentacao.findUnique({ where: { id: id } })
    }


    async delete(id: string) {
        return this.prisma.tenantClient.estoqueMovimentacao.delete({ where: { id: id } })
    }
}

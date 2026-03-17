/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RelatorialService {
    constructor(private prisma: PrismaService) {}

    async buscarTotalizador(inicio: Date, fim: Date) {
        const total = await this.buscarVendaBruta(inicio, fim)
        const pagas = await this.buscarPagas(inicio, fim)
        const canceladas = await this.buscarCanceladas(inicio, fim)
        const pendentes = await this.buscarPendentes(inicio, fim)
        const porusuario = await this.buscarPorUsuario(inicio, fim)
        const porterminal = await this.buscarPorTerminal(inicio, fim)
        return { total: total._sum, pagas: pagas._sum, canceladas: canceladas._sum, pendentes: pendentes._sum, porusuario: porusuario, porterminal: porterminal } 
    }

    // async buscarDiario(inicio: Date, fim: Date) {
    //     const total = await this.buscarVendaBruta(inicio, fim)
    //     const pagas = await this.buscarPagas(inicio, fim)
    //     const canceladas = await this.buscarCanceladas(inicio, fim)
    //     const pendentes = await this.buscarPendentes(inicio, fim)
    //     return { total: total._sum, pagas: pagas._sum, canceladas: canceladas._sum, pendentes: pendentes._sum,  } 
    // }


// ---------------------------------------------------------------------------------------------------------------------------- DIARIO
    async buscarDiario(inicio: Date, fim: Date) {
        const groupedByDay = await this.prisma.$queryRaw`
            SELECT 
                DATE(updated_at) AS dia, 
                SUM(total) as total,
                CAST(COUNT(*) AS SIGNED) AS total_vendas
            FROM Pedido
            GROUP BY dia
            ORDER BY dia DESC
        `;
        return this.formatBigInt(groupedByDay)
    }

    private formatBigInt(obj: any) {
        return JSON.parse(
            JSON.stringify(obj, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
            )
        );
    }

// ---------------------------------------------------------------------------------------------------------------------------- DADOS GERAIS (SEM FILTROS)
    async buscarVendaBruta(inicio: Date, fim: Date) {
        return this.prisma.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { created_at: { gte: inicio, lte: fim } }
        })
    }
    async buscarPagas(inicio: Date, fim: Date) {
        return this.prisma.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: "PAGA", created_at: { gte: inicio, lte: fim } }
        })
    }
    async buscarCanceladas(inicio: Date, fim: Date) {
        return this.prisma.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: "CANCELADA", created_at: { gte: inicio, lte: fim } }
        })
    }
    async buscarPendentes(inicio: Date, fim: Date) {
        return this.prisma.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: "PENDENTE" , created_at: { gte: inicio, lte: fim } } 
        })
    }




// ---------------------------------------------------------------------------------------------------------------------------- DADOS FILTRADOS
    async buscarPorUsuario(inicio: Date, fim: Date) {
        return this.prisma.pedido.groupBy({
            by: ['usuario_id'],
            _sum: { total: true, desconto: true },
            where: { status: "PENDENTE" , created_at: { gte: inicio, lte: fim } } 
        })
        
    }
    async buscarPorTerminal(inicio: Date, fim: Date) {
        return this.prisma.pedido.groupBy({
            by: ['terminal_id'],
            _sum: { total: true, desconto: true },
            where: { status: "PENDENTE" , created_at: { gte: inicio, lte: fim } } 
        })
    }


}

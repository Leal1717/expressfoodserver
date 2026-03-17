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




// ---------------------------------------------------------------------------------------------------------------------------- DIARIO

    async buscarDiario(inicio: Date, fim: Date) {

        const groupedByDay = await this.prisma.$queryRaw`
            SELECT 
                DATE(p.updated_at) AS dia,
                SUM(p.total) AS total, 
                CAST(COUNT(*) AS SIGNED) AS total_vendas,
                sum(if (p.status = 'PAGA', p.total, 0)) AS pagas,
                sum(if (p.status = 'PENDENTE', p.total, 0)) AS pendentes,
                sum(if (p.status = 'CANCELADA', p.total, 0)) AS canceladas,
                sum(if (p.status = 'PAGA', p.desconto, 0)) AS pagas_desconto,
                sum(if (p.status = 'PENDENTE', p.desconto, 0)) AS pendentes_desconto,
                sum(if (p.status = 'CANCELADA', p.desconto, 0)) AS canceladas_desconto
            FROM pedido p
            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim})
            GROUP BY dia
            ORDER BY dia asc;
 
        `;
        return this.formatBigInt(groupedByDay)
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
        const groupedByDay = await this.prisma.$queryRaw`
            SELECT 
                p.usuario_id,
                SUM(p.total) AS total, 
                CAST(COUNT(*) AS SIGNED) AS total_vendas,
                sum(if (p.status = 'PAGA', p.total, 0)) AS pagas,
                sum(if (p.status = 'PENDENTE', p.total, 0)) AS pendentes,
                sum(if (p.status = 'CANCELADA', p.total, 0)) AS canceladas,
                sum(if (p.status = 'PAGA', p.desconto, 0)) AS pagas_desconto,
                sum(if (p.status = 'PENDENTE', p.desconto, 0)) AS pendentes_desconto,
                sum(if (p.status = 'CANCELADA', p.desconto, 0)) AS canceladas_desconto
            FROM pedido p
            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim})
            GROUP BY p.usuario_id;
 
        `;
        return this.formatBigInt(groupedByDay)
    }

    async buscarPorTerminal(inicio: Date, fim: Date) {
        const groupedByDay = await this.prisma.$queryRaw`
            SELECT 
                p.terminal_id,
                SUM(p.total) AS total, 
                CAST(COUNT(*) AS SIGNED) AS total_vendas,
                sum(if (p.status = 'PAGA', p.total, 0)) AS pagas,
                sum(if (p.status = 'PENDENTE', p.total, 0)) AS pendentes,
                sum(if (p.status = 'CANCELADA', p.total, 0)) AS canceladas,
                sum(if (p.status = 'PAGA', p.desconto, 0)) AS pagas_desconto,
                sum(if (p.status = 'PENDENTE', p.desconto, 0)) AS pendentes_desconto,
                sum(if (p.status = 'CANCELADA', p.desconto, 0)) AS canceladas_desconto
            FROM pedido p
            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim})
            GROUP BY p.usuario_id;
 
        `;
        return this.formatBigInt(groupedByDay)
    }






    /**
     * Helper usado para formatar bigint que volta da query
     */
    private formatBigInt(obj: any) {
        return JSON.parse(
            JSON.stringify(obj, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
            )
        );
    }





    
// ---------------------------------------------------------------------------------------------------------------------------- DADOS FILTRADOS POR ITENS
    async buscarPorItem(inicio: Date, fim: Date) {
        const groupedByDay = await this.prisma.$queryRaw`

            SELECT 
                pit.item_id,
                i.nome,
                COUNT(pit.item_id) AS contagem,
                SUM(pit.quantidade) AS quantidade,
                SUM(pit.preco) AS preco,
                SUM(pit.desconto) AS desconto,
                ( SUM(pit.quantidade) * SUM(pit.preco)) - SUM(pit.desconto) AS liquido

            FROM pedidoitem pit
            JOIN pedido p ON pit.pedido_id = p.id
            JOIN item i ON i.id = pit.item_id
            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim}) AND p.status = 'PAGA'
            GROUP BY pit.item_id;
 
        `;

        /**
         * 
        SELECT 
	pis.item_id,
	s.nome,
	SUM(pis.quantidade) AS qtd,
	SUM(pis.quantidade * pis.preco) AS preco_total,
	SUM(pis.desconto) AS desconto_total,
	(SUM(pis.quantidade * pis.preco)) - SUM(pis.desconto) AS final
FROM pedidoitem pis
JOIN item s ON pis.item_id = s.id
JOIN pedido p ON pis.pedido_id = p.id
WHERE p.status = 'PAGA'
GROUP BY pis.item_id;

         */
        return this.formatBigInt(groupedByDay)
    }

    async buscarPorSubitem(inicio: Date, fim: Date) {
        const groupedByDay = await this.prisma.$queryRaw`

            SELECT 
                pit.subitem_id,
                s.nome,
                COUNT(pit.subitem_id) AS contagem,
                SUM(pit.quantidade) AS quantidade,
                SUM(pit.preco) AS preco,
                SUM(pit.desconto) AS desconto,
                ( SUM(pit.quantidade) * SUM(pit.preco)) - SUM(pit.desconto) AS liquido

            FROM 
                pedidoitemsubitem pit JOIN subitem s ON pit.subitem_id = s.id,
                pedidoitem pp JOIN pedido p ON p.id = pp.pedido_id

            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim}) AND p.status = 'PAGA'
            GROUP BY pit.subitem_id;
            
        `;

        /**
         * 
         SELECT 
	s.nome,
	SUM(pis.quantidade) AS qtd,
	SUM(pis.preco * pis.quantidade) AS preco_total,
	SUM(pis.desconto) AS desconto_total,
	SUM(pis.preco * pis.quantidade) - SUM(pis.desconto) AS final
FROM pedidoitemsubitem pis
JOIN subitem s ON pis.subitem_id = s.id
JOIN pedidoitem pp ON pp.id = pis.pedido_item_id
JOIN pedido p ON pp.pedido_id = p.id
WHERE p.status = 'PAGA'
GROUP BY pis.subitem_id;

         */
        return this.formatBigInt(groupedByDay)
    }

}


 
 
 


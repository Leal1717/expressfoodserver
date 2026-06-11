import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class RelatorialService {
    constructor(
        private prisma: PrismaService,
        private tenant: TenantService,
    ) {}

    async buscarTotalizador(inicio: Date, fim: Date) {
        const [pagas, canceladas, porusuario, porterminal] = await Promise.all([
            this.buscarPagas(inicio, fim),
            this.buscarCanceladas(inicio, fim),
            this.buscarPorUsuario(inicio, fim),
            this.buscarPorTerminal(inicio, fim),
        ])
        return { pagas: pagas._sum, canceladas: canceladas._sum, porusuario, porterminal }
    }




// ---------------------------------------------------------------------------------------------------------------------------- DIARIO

    async buscarDiario(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                DATE(vh.created_at) AS dia,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(IF(vh.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) AS total_pago,
                SUM(IF(vh.status = 'PAGA', vh.desconto, 0)) AS total_desconto,
                CAST(SUM(IF(vh.status = 'CANCELADA', 1, 0)) AS SIGNED) AS total_cancelado,
                SUM(IF(vh.status = 'PENDENTE', vh.total, 0)) AS total_pendente,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) / NULLIF(SUM(IF(vh.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM VendaHistorico vh
            WHERE vh.created_at >= ${inicio} AND vh.created_at < ${fim}
            AND vh.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY dia
            ORDER BY dia ASC;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarSemanal(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                YEAR(vh.created_at) AS ano,
                WEEK(vh.created_at, 1) AS semana,
                MIN(DATE(vh.created_at)) AS semana_inicio,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(IF(vh.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) AS total_pago,
                SUM(IF(vh.status = 'PAGA', vh.desconto, 0)) AS total_desconto,
                CAST(SUM(IF(vh.status = 'CANCELADA', 1, 0)) AS SIGNED) AS total_cancelado,
                SUM(IF(vh.status = 'PENDENTE', vh.total, 0)) AS total_pendente,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) / NULLIF(SUM(IF(vh.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM VendaHistorico vh
            WHERE vh.created_at >= ${inicio} AND vh.created_at < ${fim}
            AND vh.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY ano, semana
            ORDER BY ano ASC, semana ASC;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarMensal(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                YEAR(vh.created_at) AS ano,
                MONTH(vh.created_at) AS mes,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(IF(vh.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) AS total_pago,
                SUM(IF(vh.status = 'PAGA', vh.desconto, 0)) AS total_desconto,
                CAST(SUM(IF(vh.status = 'CANCELADA', 1, 0)) AS SIGNED) AS total_cancelado,
                SUM(IF(vh.status = 'PENDENTE', vh.total, 0)) AS total_pendente,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) / NULLIF(SUM(IF(vh.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM VendaHistorico vh
            WHERE vh.created_at >= ${inicio} AND vh.created_at < ${fim}
            AND vh.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY ano, mes
            ORDER BY ano ASC, mes ASC;
        `;
        return this.formatBigInt(grouped)
    }




// ---------------------------------------------------------------------------------------------------------------------------- TOTALIZADORES

    async buscarPagas(inicio: Date, fim: Date) {
        // VendaHistorico: só recebe registros quando a venda é paga — fonte correta para receita e descontos
        return this.prisma.tenantClient.vendaHistorico.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: 'PAGA', created_at: { gte: inicio, lt: fim } },
        })
    }

    async buscarCanceladas(inicio: Date, fim: Date) {
        // pedido: cancelamentos nunca fluem para VendaHistorico
        return this.prisma.tenantClient.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: 'CANCELADA', created_at: { gte: inicio, lt: fim } },
        })
    }




// ---------------------------------------------------------------------------------------------------------------------------- AGRUPADOS

    async buscarPorUsuario(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                vh.usuario_id,
                MAX(vh.usuario_nome) AS usuario_nome,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(IF(vh.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) AS total_pago,
                SUM(IF(vh.status = 'PAGA', vh.desconto, 0)) AS total_desconto,
                CAST(SUM(IF(vh.status = 'CANCELADA', 1, 0)) AS SIGNED) AS total_cancelado,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) / NULLIF(SUM(IF(vh.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM VendaHistorico vh
            WHERE vh.created_at >= ${inicio} AND vh.created_at < ${fim}
            AND vh.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY vh.usuario_id
            ORDER BY total_pago DESC;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarPorTerminal(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                vh.terminal_id,
                MAX(vh.terminal_nome) AS terminal_nome,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(IF(vh.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) AS total_pago,
                SUM(IF(vh.status = 'PAGA', vh.desconto, 0)) AS total_desconto,
                CAST(SUM(IF(vh.status = 'CANCELADA', 1, 0)) AS SIGNED) AS total_cancelado,
                SUM(IF(vh.status = 'PAGA', vh.total, 0)) / NULLIF(SUM(IF(vh.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM VendaHistorico vh
            LEFT JOIN terminal t ON t.id = vh.terminal_id
            WHERE vh.created_at >= ${inicio} AND vh.created_at < ${fim}
            AND vh.empresa_id = ${Number(this.tenant.empresaId)}
            AND (t.tipo IS NULL OR t.tipo != 'ADM')
            GROUP BY vh.terminal_id
            ORDER BY total_pago DESC;
        `;
        return this.formatBigInt(grouped)
    }




// ---------------------------------------------------------------------------------------------------------------------------- ITENS E CLASSES (já usavam VendaHistoricoItem — sem mudança de tabela)

    async buscarClasses(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                vi.classe_id AS id,
                vi.classe_nome AS nome,
                SUM(vi.quantidade) AS qtd,
                SUM(vi.preco * vi.quantidade) AS preco_total,
                SUM(vi.desconto) AS desconto_total,
                SUM(vi.total) AS final
            FROM VendaHistoricoItem vi
            WHERE vi.empresa_id = ${Number(this.tenant.empresaId)}
            AND vi.created_at >= ${inicio} AND vi.created_at < ${fim}
            AND vi.classe_id IS NOT NULL
            GROUP BY vi.classe_id, vi.classe_nome
            ORDER BY final DESC;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarItens(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                vi.item_id,
                vi.nome,
                SUM(vi.quantidade) AS qtd,
                SUM(vi.preco * vi.quantidade) AS preco_total,
                SUM(vi.desconto) AS desconto_total,
                SUM(vi.total) AS final
            FROM VendaHistoricoItem vi
            WHERE vi.empresa_id = ${Number(this.tenant.empresaId)}
            AND vi.created_at >= ${inicio} AND vi.created_at < ${fim}
            GROUP BY vi.item_id, vi.nome
            ORDER BY final DESC
            LIMIT 10;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarTodosItens(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                vi.item_id,
                vi.nome,
                SUM(vi.quantidade) AS qtd,
                SUM(vi.preco * vi.quantidade) AS preco_total,
                SUM(vi.desconto) AS desconto_total,
                SUM(vi.total) AS final
            FROM VendaHistoricoItem vi
            WHERE vi.empresa_id = ${Number(this.tenant.empresaId)}
            AND vi.created_at >= ${inicio} AND vi.created_at < ${fim}
            GROUP BY vi.item_id, vi.nome
            ORDER BY final DESC;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarSubitens(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                vs.subitem_id,
                vs.nome,
                SUM(vs.quantidade) AS qtd,
                SUM(vs.preco * vs.quantidade) AS preco_total,
                SUM(vs.total) AS final
            FROM VendaHistoricoSubitem vs
            WHERE vs.empresa_id = ${Number(this.tenant.empresaId)}
            AND vs.created_at >= ${inicio} AND vs.created_at < ${fim}
            GROUP BY vs.subitem_id, vs.nome
            ORDER BY final DESC;
        `;
        return this.formatBigInt(grouped)
    }




    private formatBigInt(obj: any) {
        return JSON.parse(
            JSON.stringify(obj, (key, value) =>
            typeof value === "bigint" ? value.toString() : value
            )
        );
    }
}

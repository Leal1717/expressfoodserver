/*
https://docs.nestjs.com/providers#services
*/

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
                DATE(p.created_at) AS dia,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(if(p.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(if(p.status = 'PAGA', p.total, 0)) AS total_pago,
                SUM(if(p.status = 'PAGA', p.desconto, 0)) AS total_desconto,
                SUM(if(p.status = 'CANCELADA', p.total, 0)) AS total_cancelado,
                SUM(if(p.status = 'PENDENTE', p.total, 0)) AS total_pendente,
                SUM(if(p.status = 'PAGA', p.total, 0)) / NULLIF(SUM(if(p.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM pedido p
            WHERE p.created_at >= ${inicio} AND p.created_at < ${fim}
            AND p.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY dia
            ORDER BY dia ASC;
        `;
        return this.formatBigInt(groupedByDay)
    }

    async buscarSemanal(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                YEAR(p.created_at) AS ano,
                WEEK(p.created_at, 1) AS semana,
                MIN(DATE(p.created_at)) AS semana_inicio,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(if(p.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(if(p.status = 'PAGA', p.total, 0)) AS total_pago,
                SUM(if(p.status = 'PAGA', p.desconto, 0)) AS total_desconto,
                SUM(if(p.status = 'CANCELADA', p.total, 0)) AS total_cancelado,
                SUM(if(p.status = 'PAGA', p.total, 0)) / NULLIF(SUM(if(p.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM pedido p
            WHERE p.created_at >= ${inicio} AND p.created_at < ${fim}
            AND p.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY ano, semana
            ORDER BY ano ASC, semana ASC;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarMensal(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                YEAR(p.created_at) AS ano,
                MONTH(p.created_at) AS mes,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(if(p.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(if(p.status = 'PAGA', p.total, 0)) AS total_pago,
                SUM(if(p.status = 'PAGA', p.desconto, 0)) AS total_desconto,
                SUM(if(p.status = 'CANCELADA', p.total, 0)) AS total_cancelado,
                SUM(if(p.status = 'PAGA', p.total, 0)) / NULLIF(SUM(if(p.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM pedido p
            WHERE p.created_at >= ${inicio} AND p.created_at < ${fim}
            AND p.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY ano, mes
            ORDER BY ano ASC, mes ASC;
        `;
        return this.formatBigInt(grouped)
    }







// ---------------------------------------------------------------------------------------------------------------------------- DADOS GERAIS (SEM FILTROS)

    async buscarVendaBruta(inicio: Date, fim: Date) {
        return this.prisma.tenantClient.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { created_at: { gte: inicio, lt: fim } },
        })
    }
    async buscarPagas(inicio: Date, fim: Date) {
        return this.prisma.tenantClient.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: 'PAGA', created_at: { gte: inicio, lt: fim } },
        })
    }
    async buscarCanceladas(inicio: Date, fim: Date) {
        return this.prisma.tenantClient.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: 'CANCELADA', created_at: { gte: inicio, lt: fim } },
        })
    }
    async buscarPendentes(inicio: Date, fim: Date) {
        return this.prisma.tenantClient.pedido.aggregate({
            _sum: { total: true, desconto: true },
            where: { status: 'PENDENTE', created_at: { gte: inicio, lt: fim } },
        })
    }




// ---------------------------------------------------------------------------------------------------------------------------- DADOS FILTRADOS
    async buscarPorUsuario(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                p.usuario_id,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(if(p.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(if(p.status = 'PAGA', p.total, 0)) AS total_pago,
                SUM(if(p.status = 'PAGA', p.desconto, 0)) AS total_desconto,
                SUM(if(p.status = 'CANCELADA', p.total, 0)) AS total_cancelado,
                SUM(if(p.status = 'PAGA', p.total, 0)) / NULLIF(SUM(if(p.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM pedido p
            WHERE p.created_at >= ${inicio} AND p.created_at < ${fim}
            AND p.empresa_id = ${Number(this.tenant.empresaId)}
            GROUP BY p.usuario_id;
        `;
        return this.formatBigInt(grouped)
    }

    async buscarPorTerminal(inicio: Date, fim: Date) {
        const grouped = await this.prisma.$queryRaw`
            SELECT
                p.terminal_id,
                CAST(COUNT(*) AS SIGNED) AS total_pedidos,
                CAST(SUM(if(p.status = 'PAGA', 1, 0)) AS SIGNED) AS total_pagos,
                SUM(if(p.status = 'PAGA', p.total, 0)) AS total_pago,
                SUM(if(p.status = 'PAGA', p.desconto, 0)) AS total_desconto,
                SUM(if(p.status = 'CANCELADA', p.total, 0)) AS total_cancelado,
                SUM(if(p.status = 'PAGA', p.total, 0)) / NULLIF(SUM(if(p.status = 'PAGA', 1, 0)), 0) AS ticket_medio
            FROM pedido p
            JOIN terminal t ON t.id = p.terminal_id
            WHERE p.created_at >= ${inicio} AND p.created_at < ${fim}
            AND p.empresa_id = ${Number(this.tenant.empresaId)}
            AND t.tipo != 'ADM'
            GROUP BY p.terminal_id;
        `;
        return this.formatBigInt(grouped)
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





    
// ---------------------------------------------------------------------------------------------------------------------------- DADOS FILTRADOS POR ITENS (usa tabelas de histórico flat)

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

}

/**
 
Acesse sua conta PagBank, com e-mail e senha; Em Maquininhas acesse Gerenciar Maquininhas; 
Clique em Problema na ativação e use seu código de ativação; Preencha o número de série e 
código de identificação da máquina e clique em continuar; Para auxiliar o cliente a localizar 
essas informações, ao lado tem o passo a passo por modelo. Pronto agora basta seguir com a ativação da máquina.

 */
 
 
 


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
    async buscarClasses(inicio: Date, fim: Date) {
        const groupedByDay = await this.prisma.$queryRaw`
            SELECT 
                c.id,
                c.nome,
                SUM(pis.quantidade) AS qtd,
                SUM(pis.quantidade * pis.preco) AS preco_total,
                SUM(pis.desconto) AS desconto_total,
                (SUM(pis.quantidade * pis.preco)) - SUM(pis.desconto) AS final
            FROM pedidoitem pis
            JOIN item s ON pis.item_id = s.id
            JOIN pedido p ON pis.pedido_id = p.id
            JOIN classe c ON s.classe_id = c.id
            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim}) AND p.status = 'PAGA'
            GROUP BY c.id;
        `;

        return this.formatBigInt(groupedByDay)
    }

    async buscarItens(inicio: Date, fim: Date) {
        const groupedByDay = await this.prisma.$queryRaw`
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
            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim}) AND p.status = 'PAGA'
            GROUP BY pis.item_id;
        `;

        return this.formatBigInt(groupedByDay)
    }

    async buscarSubitens(inicio: Date, fim: Date) {
        const groupedByDay = await this.prisma.$queryRaw`
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
            WHERE p.updated_at >= DATE(${inicio}) AND p.updated_at < DATE(${fim}) AND p.status = 'PAGA'
            GROUP BY pis.subitem_id;
            
        `;

        return this.formatBigInt(groupedByDay)
    }

}

/**
 
Acesse sua conta PagBank, com e-mail e senha; Em Maquininhas acesse Gerenciar Maquininhas; 
Clique em Problema na ativação e use seu código de ativação; Preencha o número de série e 
código de identificação da máquina e clique em continuar; Para auxiliar o cliente a localizar 
essas informações, ao lado tem o passo a passo por modelo. Pronto agora basta seguir com a ativação da máquina.

 */
 
 
 


import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';
import { AbrirCaixaDto, FecharCaixaDto, ForcarFecharCaixaDto, LiberarLoginDto, MovimentarCaixaDto } from './dto';

@Injectable()
export class CaixaService {
  constructor(
    private prisma: PrismaService,
    private tenant: TenantService,
  ) {}

  async abrir(dto: AbrirCaixaDto) {
    const empresaId = Number(this.tenant.empresaId);

    if (dto.terminal_id) {
      const aberto = await this.prisma.tenantClient.caixa.findFirst({
        where: { terminal_id: dto.terminal_id, status: 'ABERTO' },
      });
      if (aberto) throw new BadRequestException('Já existe um caixa aberto para este terminal.');
    }

    return this.prisma.tenantClient.caixa.create({
      data: {
        empresa_id: empresaId,
        terminal_id: dto.terminal_id ?? null,
        operador_id: dto.operador_id,
        operador_nome: dto.operador_nome,
        valor_abertura: dto.valor_abertura,
        observacao: dto.observacao ?? null,
      },
    });
  }

  async movimentar(dto: MovimentarCaixaDto) {
    const caixa = await this.prisma.tenantClient.caixa.findFirst({
      where: { id: dto.caixa_id, status: 'ABERTO' },
    });
    if (!caixa) throw new BadRequestException('Caixa não encontrado ou já fechado.');

    return this.prisma.tenantClient.caixaMovimentacao.create({
      data: {
        caixa_id: dto.caixa_id,
        tipo: dto.tipo,
        valor: dto.valor,
        motivo: dto.motivo ?? null,
        criado_por_id: dto.criado_por_id,
        criado_por_nome: dto.criado_por_nome,
      },
    });
  }

  async fechar(dto: FecharCaixaDto) {
    const caixa = await this.prisma.tenantClient.caixa.findFirst({
      where: { id: dto.caixa_id, status: 'ABERTO' },
      include: { movimentacoes: true },
    });
    if (!caixa) throw new BadRequestException('Caixa não encontrado ou já fechado.');

    const vendas = await this.prisma.tenantClient.vendaHistorico.findMany({
      where: { caixa_id: dto.caixa_id, status: 'PAGA' },
      include: { pagamentos: true },
    });

    const totais: Record<string, { total_bruto: number; total_liquido: number; qtd: number }> = {};
    let totalBruto = 0;
    let totalLiquido = 0;

    for (const venda of vendas) {
      for (const pag of venda.pagamentos) {
        const key = pag.tipo_pagamento ?? 'OUTRO';
        if (!totais[key]) totais[key] = { total_bruto: 0, total_liquido: 0, qtd: 0 };
        totais[key].total_bruto += Number(pag.valor);
        totais[key].total_liquido += Number(pag.valor_liquido);
        totais[key].qtd++;
        totalBruto += Number(pag.valor);
        totalLiquido += Number(pag.valor_liquido);
      }
    }

    const totalSuprimentos = caixa.movimentacoes
      .filter(m => m.tipo === 'SUPRIMENTO')
      .reduce((acc, m) => acc + Number(m.valor), 0);

    const totalSangrias = caixa.movimentacoes
      .filter(m => m.tipo === 'SANGRIA')
      .reduce((acc, m) => acc + Number(m.valor), 0);

    const vendasDinheiro = totais['DINHEIRO']?.total_bruto ?? 0;
    const valorEsperado = Number(caixa.valor_abertura) + totalSuprimentos - totalSangrias + vendasDinheiro;
    const diferenca = Number(dto.valor_contado_dinheiro) - valorEsperado;

    return this.prisma.$transaction(async (tx) => {
      const fechamento = await tx.caixaFechamento.create({
        data: {
          caixa_id: dto.caixa_id,
          valor_contado_dinheiro: dto.valor_contado_dinheiro,
          valor_esperado_dinheiro: valorEsperado,
          diferenca,
          total_bruto: totalBruto,
          total_liquido: totalLiquido,
          totais_json: totais as any,
          fechado_por_id: dto.fechado_por_id,
          fechado_por_nome: dto.fechado_por_nome,
        },
      });

      await tx.caixa.update({
        where: { id: dto.caixa_id },
        data: {
          status: 'FECHADO',
          fechado_em: new Date(),
          ...(dto.observacao ? { observacao: dto.observacao } : {}),
        },
      });

      return fechamento;
    });
  }

  async forcarFechar(caixaId: number, dto: ForcarFecharCaixaDto) {
    return this.fechar({
      caixa_id: caixaId,
      valor_contado_dinheiro: 0,
      fechado_por_id: dto.fechado_por_id,
      fechado_por_nome: dto.fechado_por_nome,
      observacao: 'Fechamento forçado pelo administrador',
    });
  }

  async buscarAberto(terminal_id?: number) {
    return this.prisma.tenantClient.caixa.findFirst({
      where: {
        status: 'ABERTO',
        ...(terminal_id ? { terminal_id } : {}),
      },
      include: { movimentacoes: true, terminal: { select: { id: true, nome: true, tipo: true } } },
    });
  }

  async resumo(id: number) {
    const caixa = await this.prisma.tenantClient.caixa.findFirst({
      where: { id },
      include: {
        movimentacoes: { orderBy: { created_at: 'asc' } },
        fechamento: true,
        terminal: { select: { id: true, nome: true, tipo: true } },
      },
    });
    if (!caixa) throw new BadRequestException('Caixa não encontrado.');

    const vendas = await this.prisma.tenantClient.vendaHistorico.findMany({
      where: { caixa_id: id, status: 'PAGA' },
      include: { pagamentos: true },
      orderBy: { created_at: 'asc' },
    });

    return { ...caixa, vendas };
  }

  async liberarLogin(caixaId: number, dto: LiberarLoginDto) {
    const caixa = await this.prisma.tenantClient.caixa.findFirst({
      where: { id: caixaId, status: 'ABERTO' },
    });
    if (!caixa) throw new BadRequestException('Caixa não encontrado ou já fechado.');

    return this.prisma.tenantClient.caixa.update({
      where: { id: caixaId },
      data: {
        login_liberado: true,
        login_liberado_por_id: dto.liberado_por_id,
        login_liberado_por_nome: dto.liberado_por_nome,
        login_liberado_em: new Date(),
      },
    });
  }

  async listar(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.tenantClient.caixa.findMany({
        skip,
        take: limit,
        orderBy: { aberto_em: 'desc' },
        include: {
          fechamento: { select: { total_bruto: true, diferenca: true } },
          terminal: { select: { id: true, nome: true, tipo: true } },
        },
      }),
      this.prisma.tenantClient.caixa.count(),
    ]);
    return { items, total, page, limit };
  }
}

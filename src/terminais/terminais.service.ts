import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';
import { Role, TerminalTipo } from '@prisma/client';
import { SalvarTerminalDto, UpdateTerminalDto, UpdateTerminalLoginDto } from './dto';
import CustomException from 'src/exceptions/exceptions';

const SENHA_PADRAO_AUTOATENDIMENTO = '123Totem!'

@Injectable()
export class TerminaisService {

    constructor(
        private prisma: PrismaService,
        private tenant: TenantService,
    ) {}

    async logar(data: UpdateTerminalLoginDto) {
        const terminal = await this.prisma.tenantClient.terminal.findUnique({
            where: { id: data.terminal_id },
            select: { faz_pagamento: true, nome: true },
        });

        if (terminal && terminal.faz_pagamento) {
            const caixaAberto = await this.prisma.tenantClient.caixa.findFirst({
                where: {
                    operador_id: data.usuario_id,
                    status: 'ABERTO',
                    NOT: { terminal_id: data.terminal_id },
                },
                include: { terminal: { select: { id: true, nome: true } } },
            });

            if (caixaAberto) {
                if (!caixaAberto.login_liberado) {
                    throw new ConflictException({
                        message: `Operador possui caixa aberto no terminal "${caixaAberto.terminal?.nome ?? 'sem terminal'}". Feche o caixa antes de entrar em outro terminal.`,
                        caixa_id: caixaAberto.id,
                        terminal_nome: caixaAberto.terminal?.nome ?? null,
                    });
                }
                // Override de supervisor consumido: resetar flag
                await this.prisma.tenantClient.caixa.update({
                    where: { id: caixaAberto.id },
                    data: {
                        login_liberado: false,
                        login_liberado_por_id: null,
                        login_liberado_por_nome: null,
                        login_liberado_em: null,
                    },
                });
            }
        }

        return await this.prisma.tenantClient.terminal.update({
            where: { id: data.terminal_id },
            data: {
                ultimo_login_data: new Date(),
                ultimo_login_usuario_id: data.usuario_id,
            },
        });
    }

    async heartbeat(terminal_id: number) {
        await this.prisma.tenantClient.terminal.update({
            where: { id: terminal_id },
            data: { ultima_atividade: new Date() },
        });
        return { ok: true };
    }

    async salvar(data: SalvarTerminalDto) {
        try {
            const terminal = await this.prisma.tenantClient.terminal.create({ data })

            const empresaId = Number(this.tenant.empresaId)

            // TOTEM e TABLET com autoatendimento=true: cria usuário individual por terminal,
            // usado pelo pareamento único do dispositivo (OrderingConfigScreen)
            if (data.tipo === TerminalTipo.TOTEM || data.autoatendimento) {
                const count = await this.prisma.tenantClient.usuario.count({
                    where: { role: Role.AUTOATENDIMENTO },
                })
                const numero = count + 1
                const prefixo = data.tipo === TerminalTipo.TOTEM ? 'TOTEM' : 'TABLET'
                const nome  = `${prefixo} ${numero}`
                const email = `${prefixo.toLowerCase()}${numero}@totem.com`

                const usuario = await this.prisma.tenantClient.usuario.create({
                    data: {
                        nome,
                        email,
                        senha:      SENHA_PADRAO_AUTOATENDIMENTO,
                        telefone:   '',
                        role:       Role.AUTOATENDIMENTO,
                        empresa_id: empresaId,
                    },
                })
                return { terminal, usuario: { id: usuario.id, nome, email, senha: SENHA_PADRAO_AUTOATENDIMENTO } }
            }

            return { terminal }
        } catch (error) {
            return CustomException(error)
        }
    }

    async buscarInfoAutoatendimento() {
        const terminais = await this.prisma.tenantClient.terminal.findMany({
            where:  { autoatendimento: true },
            select: { mesa_nome: true },
        })
        return {
            existe:      terminais.length > 0,
            mesasEmUso:  terminais.map(t => t.mesa_nome).filter(Boolean) as string[],
        }
    }

    async buscarTodos() {
        return this.prisma.tenantClient.terminal.findMany({include: { provedor_padrao: true }});
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.terminal.findUnique({where: { id: Number(id) },});
    }

    async controle() {
        const empresaId = Number(this.tenant.empresaId);
        const rows = await this.prisma.$queryRaw<any[]>`
            SELECT
                t.id                                                                     AS terminal_id,
                t.nome                                                                   AS terminal_nome,
                t.tipo                                                                   AS terminal_tipo,
                t.ativo                                                                  AS terminal_ativo,
                t.ultima_atividade,
                c.id                                                                     AS caixa_id,
                c.operador_nome,
                c.aberto_em,
                c.valor_abertura,
                u.nome                                                                   AS ultimo_operador_nome,
                COALESCE(SUM(CASE WHEN vhp.tipo_pagamento = 'DINHEIRO' THEN vhp.valor ELSE 0 END), 0) AS total_dinheiro,
                COALESCE(SUM(vhp.valor), 0)                                              AS total_vendas,
                CAST(COUNT(DISTINCT vh.id) AS SIGNED)                                   AS qtd_vendas
            FROM Terminal t
            LEFT JOIN Caixa c
                ON  c.terminal_id = t.id
                AND c.status      = 'ABERTO'
                AND c.empresa_id  = ${empresaId}
            LEFT JOIN VendaHistorico vh
                ON  vh.caixa_id   = c.id
                AND vh.empresa_id = ${empresaId}
                AND vh.status     = 'PAGA'
            LEFT JOIN VendaHistoricoPagamento vhp
                ON  vhp.venda_historico_id = vh.id
            LEFT JOIN Usuario u
                ON  u.id = t.ultimo_login_usuario_id
            WHERE t.empresa_id = ${empresaId}
            GROUP BY t.id, t.nome, t.tipo, t.ativo, t.ultima_atividade, c.id, c.operador_nome, c.aberto_em, c.valor_abertura, u.nome
            ORDER BY CASE WHEN c.id IS NULL THEN 1 ELSE 0 END ASC, t.tipo ASC, t.nome ASC
        `;

        const LIMITE_ONLINE_MS = 3 * 60 * 1000; // heartbeat a cada 60s; tolera 2 batidas perdidas
        const agora = Date.now();

        return rows.map(r => {
            const aberto = r.caixa_id !== null;
            const online = r.ultima_atividade !== null
                && (agora - new Date(r.ultima_atividade).getTime()) < LIMITE_ONLINE_MS;

            return {
                terminal_id:    Number(r.terminal_id),
                terminal_nome:  r.terminal_nome as string,
                terminal_tipo:  r.terminal_tipo as string,
                terminal_ativo: Boolean(r.terminal_ativo),
                aberto,
                online:         aberto || online,
                caixa_id:       r.caixa_id !== null ? Number(r.caixa_id) : null,
                operador_nome:  r.operador_nome ?? (online ? r.ultimo_operador_nome ?? null : null),
                aberto_em:      r.aberto_em ?? null,
                valor_abertura: r.valor_abertura !== null ? Number(r.valor_abertura) : null,
                total_dinheiro: Number(r.total_dinheiro),
                total_vendas:   Number(r.total_vendas),
                qtd_vendas:     Number(r.qtd_vendas),
            };
        });
    }

    async update(data: UpdateTerminalDto) {
        try {
            const terminal = this.prisma.tenantClient.terminal.update({
                where: { id: Number(data.id) },
                data: data,
            });
            return terminal
        } catch (error) {
            return CustomException(error)
        }
    }

    async updateAtivo(id :number) {
        const terminal  =await this.prisma.terminal.findUnique({where: {id:id}})
        return  this.prisma.terminal.update({where:{id}, data:{ativo: !terminal?.ativo}})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.terminal.delete({
            where: { id: id }
        });
    }
}

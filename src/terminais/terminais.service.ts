import { Injectable } from '@nestjs/common';
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
        return await this.prisma.tenantClient.terminal.update({
            where: {
                id: data.terminal_id
            },
            data: {
                ultimo_login_data: new Date(),
                ultimo_login_usuario_id: data.usuario_id,
            }
        })
    }

    async salvar(data: SalvarTerminalDto) {
        try {
            const terminal = await this.prisma.tenantClient.terminal.create({ data })

            // cria usuário AUTOATENDIMENTO automaticamente para totens e tablets
            if (data.tipo === TerminalTipo.AUTO_TOTEM || data.tipo === TerminalTipo.AUTO_TABLET) {
                const empresaId = Number(this.tenant.empresaId)
                const count = await this.prisma.tenantClient.usuario.count({
                    where: { role: Role.AUTOATENDIMENTO },
                })
                const numero = count + 1
                const prefixo = data.tipo === TerminalTipo.AUTO_TOTEM ? 'TOTEM' : 'TABLET'
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

    async buscarTodos() {
        return this.prisma.tenantClient.terminal.findMany({include: { provedor_padrao: true }});
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.terminal.findUnique({where: { id: Number(id) },});
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

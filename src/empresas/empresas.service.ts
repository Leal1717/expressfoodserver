
import { Injectable } from '@nestjs/common';
import { Empresa, Prisma, PrismaClient, Role, TipoFormaPagamento,   } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalvarEmpresaDto } from './dto';

@Injectable()
export class EmpresasService { 
    constructor(private prisma: PrismaService) {}

    //
    // Salvar empresas significa criar um novo cliente entao ja vamos criar alguams tabelas com um SEED pronto (pra ajudar o cliente)
    //
    async salvar(data: SalvarEmpresaDto) {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                const empresa = await tx.empresa.create({ data: data.empresa });

                const usuarioAdmin = { ...data.usuario, role: Role.OWNER, empresa_id: empresa.id };
                const user = await tx.usuario.create({ data: usuarioAdmin });

                // Seed financeiro dentro da transação usando create
                const formas = [
                    { nome: 'Dinheiro', tipo: TipoFormaPagamento.DINHEIRO, exige_troco: true, permite_parcelamento: false },
                    { nome: 'PIX', tipo: TipoFormaPagamento.PIX, exige_troco: false, permite_parcelamento: false },
                    { nome: 'Cartão Débito', tipo: TipoFormaPagamento.CARTAO_DEBITO, exige_troco: false, permite_parcelamento: false },
                    { nome: 'Cartão Crédito', tipo: TipoFormaPagamento.CARTAO_CREDITO, exige_troco: false, permite_parcelamento: true },
                ];

                for (const f of formas) {
                    await tx.formaPagamento.create({ data: { ...f, empresa_id: empresa.id } });
                }

                return { empresa, user };
            });

            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                throw new Error(`Valor único duplicado: ${error.meta?.target}`);
            }
            throw error;
        }
    }











    async buscarTodos() {
        return this.prisma.empresa.findMany()
    }
    async buscarPorId(id: number) {
        return this.prisma.empresa.findUnique({where: {id: Number(id)}, include: {plano: true}})
    }
    async update(data:Empresa) {
        return this.prisma.empresa.update({where: {id: Number(data.id)}, data: data})
    }
}

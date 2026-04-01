
import { BadRequestException, Injectable } from '@nestjs/common';
import { Empresa, Prisma, PrismaClient, Role, TipoFormaPagamento,   } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalvarEmpresaDto } from './dto';

@Injectable()
export class EmpresasService { 
    constructor(private prisma: PrismaService) {}

    //
    // Salvar empresas significa criar um novo cliente entao ja vamos criar alguams tabelas com um SEED pronto (pra ajudar o cliente).
    // Caso algum @unique tenha dado problema, nao salva nada, por isso o $transaction.
    // O email do user eh @unique e o cnpj da empresa tbm
    //
    async salvar(data: SalvarEmpresaDto) {
        try {
            const result = await this.prisma.$transaction(async (tx) => {
                // 1. Criar a empresa
                const empresa = await tx.empresa.create({ data: data.empresa });

                // 2. Criar o usuário administrador
                const usuarioAdmin = { ...data.usuario, role: Role.OWNER, empresa_id: empresa.id };
                const user = await tx.usuario.create({ data: usuarioAdmin });

                // 3. Buscar as formas de pagamento GLOBAIS que você definiu no seed anterior
                const formasGlobais = await tx.formaPagamentoGlobal.findMany();

                // 4. Mapear e criar as formas de pagamento específicas para esta empresa
                // Usamos o createMany para ser mais performático que um loop de create
                if (formasGlobais.length > 0) {
                    await tx.empresaFormaPagamento.createMany({
                        data: formasGlobais.map((f) => ({
                            forma_pagamento_id: f.id, // Vincula à forma d epagqamento global
                            ativo: true,
                            empresa_id: empresa.id, // Vincula à nova empresa
                        })),
                    });
                }

                return { empresa, user };
            });

            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new BadRequestException(`Valor único duplicado: ${error.meta?.target}`);
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

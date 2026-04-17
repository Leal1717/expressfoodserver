
import { BadRequestException, Injectable } from '@nestjs/common';
import { Empresa, Prisma, PrismaClient, Role, TerminalTipo, TipoFormaPagamento,   } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigurarFiscalEmpresaDto, SalvarEmpresaDto } from './dto';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class EmpresasService { 
    constructor(private prisma: PrismaService, private tenant:TenantService) {}

    //
    // Salvar empresas significa criar um novo cliente entao ja vamos criar alguams tabelas com um SEED pronto (pra ajudar o cliente).
    // Caso algum @unique tenha dado problema, nao salva nada, por isso o $transaction.
    // O email do user eh @unique e o cnpj da empresa tbm
    //
    async salvar(data: SalvarEmpresaDto) {
        try {
            const result = await this.prisma.$transaction(async (tx) => {

                // criar endereco da empresa
                const endereco = await tx.endereco.create({ data: data.endereco })
                // 1. Criar a empresa
                const empresa = await tx.empresa.create({ data: {...data.empresa, endereco_id: endereco.id} });

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

                // 5 criar o terminal ADM
                const terminal = await tx.terminal.create({
                    data: {
                        nome: "adm",
                        empresa_id: empresa.id,
                        tipo: "ADM"
                    }
                })

                // 6. Criar grupos fiscais padrão
                await tx.grupoFiscal.createMany({
                    data: [
                        {
                            nome: 'Alimento Produzido',
                            ncm: '21069090', // Preparações alimentícias NE (pizza, prato feito, lanche)
                            cfop: '5102',
                            origem: 0,
                            csosn: '400',   // Simples Nacional sem retenção
                            cst_pis: '07',
                            cst_cofins: '07',
                            empresa_id: empresa.id,
                        },
                        {
                            nome: 'Alimento Mercadoria',
                            ncm: '21069090', // NCM genérico — ajustar por produto se necessário
                            cfop: '5102',
                            origem: 0,
                            csosn: '400',
                            cst_pis: '07',
                            cst_cofins: '07',
                            empresa_id: empresa.id,
                        },
                        {
                            nome: 'Bebida Não Alcoólica',
                            ncm: '22021000', // Refrigerantes / águas com gás
                            cfop: '5102',
                            origem: 0,
                            csosn: '500',   // Substituição Tributária (comum em bebidas)
                            cst_pis: '07',
                            cst_cofins: '07',
                            empresa_id: empresa.id,
                        },
                        {
                            nome: 'Bebida Alcoólica',
                            ncm: '22030000', // Cervejas de malte
                            cfop: '5102',
                            origem: 0,
                            csosn: '500',   // ST
                            cst_pis: '07',
                            cst_cofins: '07',
                            empresa_id: empresa.id,
                        },
                    ],
                });

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

    async buscarLogada() {
        const id = this.tenant.empresaId
        return this.prisma.empresa.findUnique({
            where:{id: Number(id)}, 
            include: {
                plano: true,
                endereco: true,
            }})
    }

    async update(data:Empresa) {
        return this.prisma.empresa.update({where: {id: Number(data.id)}, data: data})
    }

    async configurarFiscal(data: ConfigurarFiscalEmpresaDto) {
        const id = this.tenant.empresaId;
        return this.prisma.empresa.update({ where: { id: Number(id) }, data });
    }
}

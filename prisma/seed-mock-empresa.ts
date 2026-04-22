/**
 * Seed de empresa para desenvolvimento e testes.
 *
 * Uso:
 *   npm run seed:mock-empresa
 *
 * Cria empresa, endereço, usuário OWNER, terminal ADM,
 * formas de pagamento e grupos fiscais padrão.
 * Seguro para rodar múltiplas vezes — pula se o CNPJ já existir.
 */

import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const CNPJ = '00906885000197';

async function main() {
    const jaExiste = await prisma.empresa.findUnique({ where: { cnpj: CNPJ } });
    if (jaExiste) {
        console.log(`⚠️  Empresa com CNPJ ${CNPJ} já existe (id=${jaExiste.id}). Nada foi alterado.`);
        return;
    }

    const result = await prisma.$transaction(async (tx) => {
        // 1. Endereço
        const endereco = await tx.endereco.create({
            data: {
                rua: 'Tv Luigi Pirandello',
                numero: '5122',
                cep: '83030270',
                bairro: 'Aristocrata',
                cidade: 'Sao Jose dos Pinhais',
                estado: 'PR',
            },
        });

        // 2. Empresa
        const empresa = await tx.empresa.create({
            data: {
                nome_fantasia: 'Testes & Co',
                razao_social: 'Testes and Company ltda',
                cnpj: CNPJ,
                plano_id: 1,
                endereco_id: endereco.id,
            },
        });

        // 3. Usuário OWNER
        const usuario = await tx.usuario.create({
            data: {
                nome: 'Rennan Leal',
                senha: '12345',
                email: 'leal@gmail.com',
                telefone: '41992760145',
                role: Role.OWNER,
                empresa_id: empresa.id,
            },
        });

        // 4. Formas de pagamento (vincula todas as globais)
        const formasGlobais = await tx.formaPagamentoGlobal.findMany();
        if (formasGlobais.length > 0) {
            await tx.empresaFormaPagamento.createMany({
                data: formasGlobais.map(f => ({
                    forma_pagamento_id: f.id,
                    ativo: true,
                    empresa_id: empresa.id,
                })),
            });
        }

        // 5. Terminal ADM
        await tx.terminal.create({
            data: { nome: 'adm', tipo: 'ADM', empresa_id: empresa.id },
        });

        // 6. Grupos fiscais padrão
        await tx.grupoFiscal.createMany({
            data: [
                { nome: 'Alimento Produzido',  ncm: '21069090', cfop: '5102', origem: 0, csosn: '400', cst_pis: '07', cst_cofins: '07', empresa_id: empresa.id },
                { nome: 'Alimento Mercadoria', ncm: '21069090', cfop: '5102', origem: 0, csosn: '400', cst_pis: '07', cst_cofins: '07', empresa_id: empresa.id },
                { nome: 'Bebida Não Alcoólica', ncm: '22021000', cfop: '5102', origem: 0, csosn: '500', cst_pis: '07', cst_cofins: '07', empresa_id: empresa.id },
                { nome: 'Bebida Alcoólica',    ncm: '22030000', cfop: '5102', origem: 0, csosn: '500', cst_pis: '07', cst_cofins: '07', empresa_id: empresa.id },
            ],
        });

        return { empresa, usuario };
    });

    console.log(`✅ Empresa:  ${result.empresa.nome_fantasia} (id=${result.empresa.id})`);
    console.log(`✅ Usuário:  ${result.usuario.nome} (${result.usuario.email})`);
    console.log(`✅ Terminal ADM, formas de pagamento e grupos fiscais criados`);
    console.log(`\n🏢 empresa_id=${result.empresa.id} — use no header empresa-id`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

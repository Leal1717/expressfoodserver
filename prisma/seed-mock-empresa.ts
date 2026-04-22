/**
 * Seed de empresa para desenvolvimento e testes.
 *
 * Uso:
 *   npx ts-node -r tsconfig-paths/register prisma/seed-mock-empresa.ts
 *   npm run seed:mock-empresa
 *
 * Cria (ou reutiliza) empresa, endereço e usuário OWNER.
 * Seguro para rodar múltiplas vezes — usa upsert/findFirst.
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // 1. Endereço
    const endereco = await prisma.endereco.create({
        data: {
            rua: 'Tv Luigi Pirandello',
            numero: '5122',
            cep: '83030270',
            bairro: 'Aristocrata',
            cidade: 'Sao Jose dos Pinhais',
            estado: 'PR',
        },
    });

    // 2. Empresa (upsert por CNPJ)
    const empresa = await prisma.empresa.upsert({
        where: { cnpj: '00906885000197' },
        create: {
            nome_fantasia: 'Testes & Co',
            razao_social: 'Testes and Company ltda',
            cnpj: '00906885000197',
            plano_id: 1,
            endereco_id: endereco.id,
        },
        update: {},
    });

    console.log(`✅ Empresa: ${empresa.nome_fantasia} (id=${empresa.id})`);

    // 3. Usuário OWNER (upsert por email)
    const senhaHash = await bcrypt.hash('12345', 10);
    const usuario = await prisma.usuario.upsert({
        where: { email: 'leal@gmail.com' },
        create: {
            nome: 'Rennan Leal',
            senha: senhaHash,
            email: 'leal@gmail.com',
            telefone: '41992760145',
            role: 'OWNER',
            empresa_id: empresa.id,
        },
        update: {},
    });

    console.log(`✅ Usuário: ${usuario.nome} (id=${usuario.id}, role=${usuario.role})`);
    console.log(`\n🏢 empresa_id=${empresa.id} — use este valor no header empresa-id das rotas autenticadas`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

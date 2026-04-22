/**
 * Script de seed para popular subitens e itens de um restaurante fictício.
 *
 * Uso:
 *   EMPRESA_ID=1 npx ts-node prisma/seed-mock.ts
 *
 * Ou adicione no package.json:
 *   "seed:mock": "EMPRESA_ID=1 ts-node prisma/seed-mock.ts"
 */

import { PrismaClient, ItemTipo, ItemSubitemTipo, UnidadeMedida } from '@prisma/client';

const prisma = new PrismaClient();

const EMPRESA_ID = Number(process.env.EMPRESA_ID);
if (!EMPRESA_ID) {
    console.error('❌  Defina a variável de ambiente EMPRESA_ID antes de rodar o script.');
    console.error('   Exemplo: EMPRESA_ID=1 npx ts-node prisma/seed-mock.ts');
    process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DE SUBITENS
// ─────────────────────────────────────────────────────────────────────────────

const SUBITENS_DATA = [
    // Matérias-primas básicas
    { nome: 'Pão de Hambúrguer',   controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Carne Bovina 180g',   controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Queijo Cheddar',      controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Alface',              controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Tomate',              controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Molho Especial',      controla_estoque: false, unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Frango Grelhado',     controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Bacon',               controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Mussarela',           controla_estoque: true,  unidade_compra: UnidadeMedida.KG,  unidade_venda: UnidadeMedida.UN,  fator_conversao: 8  },
    { nome: 'Presunto',            controla_estoque: true,  unidade_compra: UnidadeMedida.KG,  unidade_venda: UnidadeMedida.UN,  fator_conversao: 10 },
    { nome: 'Calabresa',           controla_estoque: true,  unidade_compra: UnidadeMedida.KG,  unidade_venda: UnidadeMedida.UN,  fator_conversao: 6  },
    { nome: 'Rúcula',              controla_estoque: false, unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Pepino',              controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Ovo',                 controla_estoque: true,  unidade_compra: UnidadeMedida.DZ,  unidade_venda: UnidadeMedida.UN,  fator_conversao: 12 },
    { nome: 'Catupiry',            controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Palmito',             controla_estoque: false, unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Molho Picante',       controla_estoque: false, unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Cebola Caramelizada', controla_estoque: false, unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Cream Cheese',        controla_estoque: true,  unidade_compra: UnidadeMedida.UN,  unidade_venda: UnidadeMedida.UN  },
    { nome: 'Batata Palito',       controla_estoque: true,  unidade_compra: UnidadeMedida.KG,  unidade_venda: UnidadeMedida.UN,  fator_conversao: 4  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DE ITENS (referencia subitens por nome — resolvido no script)
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DE CLASSES DE CARDÁPIO
// ─────────────────────────────────────────────────────────────────────────────

const CLASSES_DATA = [
    { nome: 'Hambúrgueres', index: 0 },
    { nome: 'Pizzas',       index: 1 },
    { nome: 'Saladas',      index: 2 },
    { nome: 'Porções',      index: 3 },
    { nome: 'Bebidas',      index: 4 },
    { nome: 'Sobremesas',   index: 5 },
    { nome: 'Combos',       index: 6 },
];

// ─────────────────────────────────────────────────────────────────────────────
// DADOS DE ITENS (referencia subitens por nome — resolvido no script)
// ─────────────────────────────────────────────────────────────────────────────

type SubitemRef = { nome: string; tipo: ItemSubitemTipo; quantidade: number; preco?: number };
type ItemRef    = { nome: string; quantidade: number };

interface ItemSeed {
    nome: string;
    descricao?: string;
    preco: number;
    tempo_preparo: number;
    classe: string;
    subitens: SubitemRef[];
    combo_itens?: ItemRef[];
}

const ITENS_DATA: ItemSeed[] = [
    // ── PRODUTOS ──────────────────────────────────────────────────────────────
    {
        nome: 'X-Burguer',
        descricao: 'Hambúrguer clássico com carne, queijo cheddar e molho especial',
        preco: 22.90,
        tempo_preparo: 12,
        classe: 'Hambúrgueres',
        subitens: [
            { nome: 'Pão de Hambúrguer',   tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Carne Bovina 180g',   tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Queijo Cheddar',      tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Alface',              tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Tomate',              tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Molho Especial',      tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Cebola Caramelizada', tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 2.00 },
            { nome: 'Molho Picante',       tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 1.00 },
        ],
    },
    {
        nome: 'X-Bacon',
        descricao: 'Hambúrguer com bacon crocante e ovo frito',
        preco: 27.90,
        tempo_preparo: 15,
        classe: 'Hambúrgueres',
        subitens: [
            { nome: 'Pão de Hambúrguer', tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Carne Bovina 180g', tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Queijo Cheddar',    tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Bacon',             tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 2 },
            { nome: 'Alface',            tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Tomate',            tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Molho Especial',    tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Ovo',               tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 3.00 },
        ],
    },
    {
        nome: 'X-Frango',
        descricao: 'Hambúrguer de frango grelhado com catupiry',
        preco: 24.90,
        tempo_preparo: 12,
        classe: 'Hambúrgueres',
        subitens: [
            { nome: 'Pão de Hambúrguer', tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Frango Grelhado',   tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Queijo Cheddar',    tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Alface',            tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Tomate',            tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Molho Especial',    tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Catupiry',          tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 2.50 },
        ],
    },
    {
        nome: 'Pizza Margherita',
        descricao: 'Pizza clássica com mussarela, tomate e rúcula',
        preco: 42.00,
        tempo_preparo: 20,
        classe: 'Pizzas',
        subitens: [
            { nome: 'Mussarela', tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Tomate',    tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 3 },
            { nome: 'Rúcula',    tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 2.00 },
        ],
    },
    {
        nome: 'Pizza Calabresa',
        descricao: 'Pizza com calabresa e cebola',
        preco: 45.00,
        tempo_preparo: 20,
        classe: 'Pizzas',
        subitens: [
            { nome: 'Mussarela',  tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Calabresa',  tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Tomate',     tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 2 },
            { nome: 'Cebola Caramelizada', tipo: ItemSubitemTipo.AMBOS, quantidade: 1, preco: 2.00 },
            { nome: 'Molho Picante',       tipo: ItemSubitemTipo.ADICIONAL, quantidade: 1, preco: 1.00 },
        ],
    },
    {
        nome: 'Pizza Frango com Catupiry',
        descricao: 'Pizza de frango com catupiry e palmito',
        preco: 48.00,
        tempo_preparo: 22,
        classe: 'Pizzas',
        subitens: [
            { nome: 'Mussarela',    tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Frango Grelhado', tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Catupiry',     tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Palmito',      tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 3.00 },
        ],
    },
    {
        nome: 'Salada Caesar',
        descricao: 'Salada com frango grelhado, queijo e presunto',
        preco: 28.00,
        tempo_preparo: 8,
        classe: 'Saladas',
        subitens: [
            { nome: 'Alface',        tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 2 },
            { nome: 'Frango Grelhado', tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Queijo Cheddar', tipo: ItemSubitemTipo.MATERIA_PRIMA, quantidade: 1 },
            { nome: 'Presunto',      tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 2.50 },
            { nome: 'Cream Cheese',  tipo: ItemSubitemTipo.ADICIONAL,     quantidade: 1, preco: 3.00 },
        ],
    },

    // ── MERCADORIAS (sem subitens) ─────────────────────────────────────────
    {
        nome: 'Coca-Cola 350ml',
        preco: 6.00,
        tempo_preparo: 0,
        classe: 'Bebidas',
        subitens: [],
    },
    {
        nome: 'Guaraná Antarctica 350ml',
        preco: 6.00,
        tempo_preparo: 0,
        classe: 'Bebidas',
        subitens: [],
    },
    {
        nome: 'Água Mineral 500ml',
        preco: 4.00,
        tempo_preparo: 0,
        classe: 'Bebidas',
        subitens: [],
    },
    {
        nome: 'Suco de Laranja Natural 300ml',
        preco: 9.00,
        tempo_preparo: 5,
        classe: 'Bebidas',
        subitens: [],
    },
    {
        nome: 'Batata Frita Porção',
        descricao: 'Porção de batata frita crocante',
        preco: 18.00,
        tempo_preparo: 10,
        classe: 'Porções',
        subitens: [],
    },
    {
        nome: 'Sorvete de Creme',
        descricao: 'Casquinha ou copinho',
        preco: 7.00,
        tempo_preparo: 2,
        classe: 'Sobremesas',
        subitens: [],
    },
    {
        nome: 'Brownie',
        descricao: 'Brownie de chocolate com calda',
        preco: 12.00,
        tempo_preparo: 2,
        classe: 'Sobremesas',
        subitens: [],
    },
    {
        nome: 'Pão de Alho',
        descricao: 'Pão de alho com manteiga e ervas',
        preco: 10.00,
        tempo_preparo: 5,
        classe: 'Porções',
        subitens: [],
    },
    {
        nome: 'Red Bull 250ml',
        preco: 14.00,
        tempo_preparo: 0,
        classe: 'Bebidas',
        subitens: [],
    },

    // ── COMBOS ────────────────────────────────────────────────────────────────
    {
        nome: 'Combo X-Burguer',
        descricao: 'X-Burguer + Batata Frita + Coca-Cola 350ml',
        preco: 39.90,
        tempo_preparo: 15,
        classe: 'Combos',
        subitens: [],
        combo_itens: [
            { nome: 'X-Burguer',          quantidade: 1 },
            { nome: 'Batata Frita Porção', quantidade: 1 },
            { nome: 'Coca-Cola 350ml',     quantidade: 1 },
        ],
    },
    {
        nome: 'Combo X-Bacon',
        descricao: 'X-Bacon + Batata Frita + Guaraná',
        preco: 44.90,
        tempo_preparo: 18,
        classe: 'Combos',
        subitens: [],
        combo_itens: [
            { nome: 'X-Bacon',                   quantidade: 1 },
            { nome: 'Batata Frita Porção',        quantidade: 1 },
            { nome: 'Guaraná Antarctica 350ml',   quantidade: 1 },
        ],
    },
    {
        nome: 'Combo X-Frango',
        descricao: 'X-Frango + Batata Frita + Água Mineral',
        preco: 41.90,
        tempo_preparo: 15,
        classe: 'Combos',
        subitens: [],
        combo_itens: [
            { nome: 'X-Frango',            quantidade: 1 },
            { nome: 'Batata Frita Porção', quantidade: 1 },
            { nome: 'Água Mineral 500ml',  quantidade: 1 },
        ],
    },
    {
        nome: 'Combo Pizza + Refri',
        descricao: 'Pizza Margherita + Coca-Cola + Sorvete',
        preco: 58.00,
        tempo_preparo: 22,
        classe: 'Combos',
        subitens: [],
        combo_itens: [
            { nome: 'Pizza Margherita',  quantidade: 1 },
            { nome: 'Coca-Cola 350ml',   quantidade: 1 },
            { nome: 'Sorvete de Creme',  quantidade: 1 },
        ],
    },
    {
        nome: 'Combo Família',
        descricao: 'Pizza Calabresa + Pizza Frango com Catupiry + 2 Guaranás',
        preco: 98.00,
        tempo_preparo: 25,
        classe: 'Combos',
        subitens: [],
        combo_itens: [
            { nome: 'Pizza Calabresa',           quantidade: 1 },
            { nome: 'Pizza Frango com Catupiry', quantidade: 1 },
            { nome: 'Guaraná Antarctica 350ml',  quantidade: 2 },
        ],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// EXECUÇÃO
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`\n🌱  Iniciando seed para empresa_id = ${EMPRESA_ID}\n`);

    // 1. Criar classes de cardápio
    console.log('🗂️   Criando classes...');
    const classeMap: Record<string, number> = {};

    for (const data of CLASSES_DATA) {
        const classe = await prisma.classe.upsert({
            where: { nome_empresa_id: { nome: data.nome, empresa_id: EMPRESA_ID } },
            update: {},
            create: { nome: data.nome, index: data.index, empresa_id: EMPRESA_ID },
        });
        classeMap[data.nome] = classe.id;
        console.log(`   ✓ ${data.nome} (id: ${classe.id})`);
    }

    // 2. Criar subitens
    console.log('\n📦  Criando subitens...');
    const subitemMap: Record<string, number> = {};

    for (const data of SUBITENS_DATA) {
        const subitem = await prisma.subitem.upsert({
            where: { nome_empresa_id: { nome: data.nome, empresa_id: EMPRESA_ID } },
            update: {},
            create: {
                nome: data.nome,
                controla_estoque: data.controla_estoque,
                unidade_compra: data.unidade_compra,
                unidade_venda: data.unidade_venda,
                fator_conversao: (data as any).fator_conversao ?? null,
                empresa_id: EMPRESA_ID,
            },
        });

        if (subitem.controla_estoque) {
            await prisma.estoquePosicao.upsert({
                where: { subitem_id: subitem.id },
                update: {},
                create: {
                    subitem_id: subitem.id,
                    empresa_id: EMPRESA_ID,
                    quantidade_fisica: 50,
                    estoque_minimo: 5,
                    custo_unitario: 0,
                },
            });
        }

        subitemMap[data.nome] = subitem.id;
        console.log(`   ✓ ${data.nome} (id: ${subitem.id})`);
    }

    // 3. Criar itens não-combo primeiro (PRODUTO e MERCADORIA)
    console.log('\n🍔  Criando itens (produtos e mercadorias)...');
    const itemMap: Record<string, number> = {};
    const naoCombo = ITENS_DATA.filter(i => !i.combo_itens || i.combo_itens.length === 0);

    for (const data of naoCombo) {
        const tipo: ItemTipo = data.subitens.length > 0 ? 'PRODUTO' : 'MERCADORIA';

        const item = await prisma.item.upsert({
            where: { nome_empresa_id: { nome: data.nome, empresa_id: EMPRESA_ID } },
            update: {},
            create: {
                nome: data.nome,
                descricao: data.descricao ?? null,
                preco: data.preco,
                tipo,
                tempo_preparo: data.tempo_preparo,
                empresa_id: EMPRESA_ID,
                classe_id: classeMap[data.classe] ?? null,
                subitens: {
                    create: data.subitens.map(s => ({
                        subitem_id: subitemMap[s.nome],
                        tipo: s.tipo,
                        quantidade: s.quantidade,
                        preco: s.preco ?? null,
                    })),
                },
            },
        });

        itemMap[data.nome] = item.id;
        console.log(`   ✓ [${tipo}] ${data.nome} (id: ${item.id})`);
    }

    // 4. Criar combos (dependem dos itens acima)
    console.log('\n🎁  Criando combos...');
    const combos = ITENS_DATA.filter(i => i.combo_itens && i.combo_itens.length > 0);

    for (const data of combos) {
        const item = await prisma.item.upsert({
            where: { nome_empresa_id: { nome: data.nome, empresa_id: EMPRESA_ID } },
            update: {},
            create: {
                nome: data.nome,
                descricao: data.descricao ?? null,
                preco: data.preco,
                tipo: 'COMBO',
                tempo_preparo: data.tempo_preparo,
                empresa_id: EMPRESA_ID,
                classe_id: classeMap[data.classe] ?? null,
                combos_as_combo: {
                    create: data.combo_itens!.map(ci => ({
                        item_id: itemMap[ci.nome],
                        quantidade: ci.quantidade,
                    })),
                },
            },
        });

        itemMap[data.nome] = item.id;
        console.log(`   ✓ [COMBO] ${data.nome} (id: ${item.id})`);
    }

    console.log(`\n✅  Seed concluído: ${CLASSES_DATA.length} classes, ${SUBITENS_DATA.length} subitens e ${ITENS_DATA.length} itens criados para empresa ${EMPRESA_ID}.\n`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());

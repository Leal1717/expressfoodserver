import { DayOfWeek, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await planos()
  await diasDaSemana()
  await bandeirasCartao()

  console.log('Seed finalizado com sucesso!');
}




async function planos() {
  const itens = [
    { id: 1, nome: 'Básico', preco: 4.99, qtd_licencas: 3 },
    { id: 2, nome: 'Medio', preco: 14.99, qtd_licencas: 10 },
    { id: 3, nome: 'Grande', preco: 34.99, qtd_licencas: 30 },
  ];

  console.log('Iniciando seed de dias da semana...');

 for (const item of itens) {
    console.log(`Tentando inserir plano: ${item.nome}...`);
    
    // Usamos $executeRaw para rodar o SQL puro. 
    // O Prisma não vai tentar "ler" o retorno, apenas executa.
    await prisma.$executeRaw`
      INSERT IGNORE INTO Plano (id, nome, preco, qtd_licencas) 
      VALUES (${item.id}, ${item.nome}, ${item.preco}, ${item.qtd_licencas})
    `;
    
    // Se o seu banco for PostgreSQL, use:
    // INSERT INTO "DiaDaSemana" (id, name) VALUES (${day.id}, ${day.name}) ON CONFLICT DO NOTHING;
  }
}





async function diasDaSemana() {
   const itens = [
    { id: 0, nome_completo: 'Domingo', nome_abreviado: "Dom", nome_enum: DayOfWeek.DOMINGO },  
    { id: 1, nome_completo: 'Segunda-feira', nome_abreviado: "Seg", nome_enum: DayOfWeek.SEGUNDA },  
    { id: 2, nome_completo: 'Terça-feira', nome_abreviado: "Ter", nome_enum: DayOfWeek.TERCA },  
    { id: 3, nome_completo: 'Quarta-feira', nome_abreviado: "Qua", nome_enum: DayOfWeek.QUARTA },  
    { id: 4, nome_completo: 'Quinta-feira', nome_abreviado: "Qui", nome_enum: DayOfWeek.QUINTA },  
    { id: 5, nome_completo: 'Sexta-feira', nome_abreviado: "Sex", nome_enum: DayOfWeek.SEXTA },  
    { id: 6, nome_completo: 'Sábado', nome_abreviado: "Sab", nome_enum: DayOfWeek.SABADO },  
  ];

  console.log('Iniciando seed de dias da semana...');

 for (const item of itens) {
    console.log(`Tentando inserir: ${item.nome_completo}...`);
    
    // Usamos $executeRaw para rodar o SQL puro. 
    // O Prisma não vai tentar "ler" o retorno, apenas executa.
    await prisma.$executeRaw`
      INSERT IGNORE INTO DiaDaSemana (id, nome_completo, nome_abreviado, nome_enum) 
      VALUES (${item.id}, ${item.nome_completo}, ${item.nome_abreviado}, ${item.nome_enum})
    `;
    
    // Se o seu banco for PostgreSQL, use:
    // INSERT INTO "DiaDaSemana" (id, name) VALUES (${day.id}, ${day.name}) ON CONFLICT DO NOTHING;
  }
}




/** bandeiras */
async function bandeirasCartao() { 
  console.log(`Tentando inserir: bandeiras cartao`);
  await prisma.bandeira.createMany({
    data: [
      { nome: 'VISA' },
      { nome: 'MASTERCARD' },
      { nome: 'ELO' },
      { nome: 'AMEX' },
      { nome: 'HIPERCARD' },

      { nome: 'DINERS CLUB' },
      { nome: 'DISCOVER' },
      { nome: 'JCB' },
      { nome: 'AURA' },

      { nome: 'SODEXO' },
      { nome: 'TICKET' },
      { nome: 'VR' },
      { nome: 'ALELO' },
      { nome: 'BEN' },

      { nome: 'CABAL' }
    ],
    skipDuplicates: true,
  });
}






main().catch((e) => {console.error(e);process.exit(1);}).finally(async () => {await prisma.$disconnect();});
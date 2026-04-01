
import { PrismaClient, DayOfWeek, TipoFormaPagamento } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await planos()
  await diasDaSemana()
  await bandeirasCartao()
  await formasDePagamento()

  console.log('✅ Todos os seeds foram finalizados com sucesso!');
}

async function planos() {
  const itens = [
    { id: 1, nome: 'Básico', preco: 4.99, qtd_licencas: 3 },
    { id: 2, nome: 'Medio', preco: 14.99, qtd_licencas: 10 },
    { id: 3, nome: 'Grande', preco: 34.99, qtd_licencas: 30 },
  ];

  console.log('🌱 Iniciando seed de planos...');
  for (const item of itens) {
    await prisma.plano.upsert({
      where: { id: item.id }, // O ID é único por padrão
      update: {
        nome: item.nome,
        preco: item.preco,
        qtd_licencas: item.qtd_licencas
      },
      create: item,
    });
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

  console.log('🌱 Iniciando seed de dias da semana...');
  for (const item of itens) {
    await prisma.diaDaSemana.upsert({
      where: { id: item.id },
      update: {
        nome_completo: item.nome_completo,
        nome_abreviado: item.nome_abreviado,
        nome_enum: item.nome_enum
      },
      create: item,
    });
  }
}

async function bandeirasCartao() { 
  console.log('🌱 Iniciando seed de bandeiras...');
  const bandeiras = [
    { nome: 'VISA' }, { nome: 'MASTERCARD' }, { nome: 'ELO' }, { nome: 'AMEX' },
    { nome: 'HIPERCARD' }, { nome: 'DINERS CLUB' }, { nome: 'DISCOVER' },
    { nome: 'JCB' }, { nome: 'AURA' }, { nome: 'SODEXO' }, { nome: 'TICKET' },
    { nome: 'VR' }, { nome: 'ALELO' }, { nome: 'BEN' }, { nome: 'CABAL' }
  ];

  // createMany com skipDuplicates é ótimo para listas grandes onde os dados não mudam!
  // Só certifique-se de que o campo 'nome' é @unique na sua model Bandeira
  await prisma.bandeira.createMany({
    data: bandeiras,
    skipDuplicates: true,
  });
}

async function formasDePagamento() {
  const formas = [
    { id: 1, nome: 'Dinheiro', tipo: TipoFormaPagamento.DINHEIRO, exige_troco: true, permite_parcelamento: false },
    { id: 2, nome: 'PIX', tipo: TipoFormaPagamento.PIX, exige_troco: false, permite_parcelamento: false },
    { id: 3, nome: 'Cartão Débito', tipo: TipoFormaPagamento.CARTAO_DEBITO, exige_troco: false, permite_parcelamento: false },
    { id: 4, nome: 'Cartão Crédito', tipo: TipoFormaPagamento.CARTAO_CREDITO, exige_troco: false, permite_parcelamento: true },
    { id: 5, nome: 'Vale Refeição / Alimentação', tipo: TipoFormaPagamento.VOUCHER, exige_troco: false, permite_parcelamento: false },
    { id: 6, nome: 'Outros / Convênio', tipo: TipoFormaPagamento.OUTRO, exige_troco: false, permite_parcelamento: false },
  ];

  console.log('🌱 Iniciando seed de formas de pagamento...');
  for (const formaPag of formas) {
    await prisma.formaPagamentoGlobal.upsert({
      where: { id : formaPag.id}, 
      update: {
        nome: formaPag.nome,
        exige_troco: formaPag.exige_troco,
        permite_parcelamento: formaPag.permite_parcelamento,
      },
      create: formaPag,
    });
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
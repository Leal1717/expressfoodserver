import { PedidoStatus,  } from "@prisma/client"

export class CreateVendaDto {
  total: number;               // total da venda (sem desconto)
  desconto?: number;           // desconto total da venda
  status?: PedidoStatus;        // opcional, padrão PENDENTE

  empresa_id: number;          // ID da empresa
  usuario_id: number;          // ID do usuario

  itens: CreateVendaItemDto[]; // itens da venda
}

export class CreateVendaItemDto {
  item_id: number;             // ID do produto ou combo
  quantidade: number;          // quantidade vendida
  preco: number;               // preço unitário do item (original)
  desconto?: number;           // desconto aplicado nesse item

  subitens?: CreateVendaItemSubitemDto[]; // subitens opcionais
}

export class CreateVendaItemSubitemDto {
  subitem_id: number;          // ID do subitem
  quantidade: number;          // quantidade usada/vendida
  preco: number;               // preço do subitem
  desconto?: number;           // desconto aplicado no subitem
}
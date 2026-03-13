import { PedidoStatus,  } from "@prisma/client"

export class CreatePedidoDto {
  total: number;               // total da venda (sem desconto)
  desconto?: number;           // desconto total da venda
  status?: PedidoStatus;        // opcional, padrão PENDENTE

  usuario_id: number;          // ID do usuario

  mesa_id?: number;          // ID da mesa
  comanda_id?: string;          // ID da comanda
  senha_id?: string;          // ID da senha

  itens: CreatePedidoItemDto[]; // itens da venda
}

export class CreatePedidoItemDto {
  item_id: number;             // ID do produto ou combo
  quantidade: number;          // quantidade vendida
  preco: number;               // preço unitário do item (original)
  desconto?: number;           // desconto aplicado nesse item

  subitens?: CreatePedidoItemSubitemDto[]; // subitens opcionais
}

export class CreatePedidoItemSubitemDto {
  subitem_id: number;          // ID do subitem
  quantidade: number;          // quantidade usada/vendida
  preco: number;               // preço do subitem
  desconto?: number;           // desconto aplicado no subitem
}



// filtros de busca
export class PedidoQueryDto {
  status?: PedidoStatus;
  usuario?: number;
  mesa?: number;
  comanda?: string;
  senha?: string;
}
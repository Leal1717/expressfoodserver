import { PedidoStatus,  } from "@prisma/client"

export class CreatePedidoDto {
  total: number;               // total da venda (sem desconto)
  desconto?: number;           // desconto total da venda
  status?: PedidoStatus;        // opcional, padrão PENDENTE

  observacao?: string;

  usuario_id: number;          // ID do usuario
  terminal_id?: number;          // ID do terminal caso exista

  mesa_id?: string;          // ID da mesa
  comanda_id?: string;          // ID da comanda
  senha_id?: number;          // ID da senha
  criar_senha?: boolean;          // ID da senha



  itens: CreatePedidoItemDto[]; // itens da venda
}

export class CreatePedidoItemDto {
  item_id: number;             // ID do produto ou combo
  quantidade: number;          // quantidade vendida
  preco: number;               // preço unitário do item (original)
  desconto?: number;           // desconto aplicado nesse item
  observacao?: string;

  subitens?: CreatePedidoItemSubitemDto[]; // subitens opcionais
}

export class CreatePedidoItemSubitemDto {
  subitem_id: number;          // ID do subitem
  quantidade: number;          // quantidade usada/vendida
  preco: number;               // preço do subitem
  desconto?: number;           // desconto aplicado no subitem
}



// filtros de busca
export class OperacionalQueryDto {
  status?: PedidoStatus;
  usuario?: number;
  mesa?: string;
  comanda?: string;
  senha?: number;
}

// 
export class OperacionalPedirContaDto {
  mesa?: string;
  comanda?: string;
}
// 
export class OperacionalPagarDto {
  mesa?: string;
  comanda?: string;
  senha?: number;
}
// 
export class OperacionalResponseFormatoDto {
  mesa?: number;
  comanda?: string;
  senha?: string;
}
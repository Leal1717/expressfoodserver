import { PedidoStatus,  } from "@prisma/client"
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// -------------------- SUBITEM

export class CreatePedidoItemSubitemDto {
  @IsInt()
  @Type(() => Number)
  subitem_id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  preco: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  desconto?: number;
}

// -------------------- ITEM

export class CreatePedidoItemDto {
  @IsInt()
  @Type(() => Number)
  item_id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  preco: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  desconto?: number;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemSubitemDto)
  subitens?: CreatePedidoItemSubitemDto[];
}

// -------------------- PEDIDO

export class CreatePedidoDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  total: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  desconto?: number;

  @IsOptional()
  @IsEnum(PedidoStatus)
  status?: PedidoStatus;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsInt()
  @Type(() => Number)
  usuario_id: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  terminal_id?: number;

  @IsOptional()
  @IsString()
  mesa_id?: string;

  @IsOptional()
  @IsString()
  comanda_id?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  senha_id?: number;

  @IsOptional()
  @IsBoolean()
  criar_senha?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  itens: CreatePedidoItemDto[];
}

// -------------------- QUERY

export class OperacionalQueryDto {
  @IsOptional()
  @IsEnum(PedidoStatus)
  status?: PedidoStatus;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  usuario?: number;

  @IsOptional()
  @IsString()
  mesa?: string;

  @IsOptional()
  @IsString()
  comanda?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  senha?: number;
}

// -------------------- PEDIR CONTA

export class OperacionalPedirContaDto {
  @IsOptional()
  @IsString()
  mesa?: string;

  @IsOptional()
  @IsString()
  comanda?: string;
}

// -------------------- PAGAR



// -------------------- PAGAMENTO ITEM

export class CreatePedidoPagamentoDto {
  @IsInt()
  @Type(() => Number)
  forma_pagamento_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  valor: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  parcelas?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  troco_para?: number;
}

// -------------------- PAGAR (FINAL)

export class OperacionalPagarDto {
  @IsOptional()
  @IsString()
  mesa?: string;

  @IsOptional()
  @IsString()
  comanda?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  senha?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoPagamentoDto)
  pagamentos: CreatePedidoPagamentoDto[];
}

// -------------------- PAGAR RESPONSE

export class OperacionalResponseFormatoDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  mesa?: number;

  @IsOptional()
  @IsString()
  comanda?: string;

  @IsOptional()
  @IsString()
  senha?: string;
}

// export class CreatePedidoDto {
//   total: number;               // total da venda (sem desconto)
//   desconto?: number;           // desconto total da venda
//   status?: PedidoStatus;        // opcional, padrão PENDENTE

//   observacao?: string;

//   usuario_id: number;          // ID do usuario
//   terminal_id?: number;          // ID do terminal caso exista

//   mesa_id?: string;          // ID da mesa
//   comanda_id?: string;          // ID da comanda
//   senha_id?: number;          // ID da senha
//   criar_senha?: boolean;          // ID da senha



//   itens: CreatePedidoItemDto[]; // itens da venda
// }

// export class CreatePedidoItemDto {
//   item_id: number;             // ID do produto ou combo
//   quantidade: number;          // quantidade vendida
//   preco: number;               // preço unitário do item (original)
//   desconto?: number;           // desconto aplicado nesse item
//   observacao?: string;

//   subitens?: CreatePedidoItemSubitemDto[]; // subitens opcionais
// }

// export class CreatePedidoItemSubitemDto {
//   subitem_id: number;          // ID do subitem
//   quantidade: number;          // quantidade usada/vendida
//   preco: number;               // preço do subitem
//   desconto?: number;           // desconto aplicado no subitem
// }



// // filtros de busca
// export class OperacionalQueryDto {
//   status?: PedidoStatus;
//   usuario?: number;
//   mesa?: string;
//   comanda?: string;
//   senha?: number;
// }

// // 
// export class OperacionalPedirContaDto {
//   mesa?: string;
//   comanda?: string;
// }
// // 
// export class OperacionalPagarDto {
//   mesa?: string;
//   comanda?: string;
//   senha?: number;
// }
// // 
// export class OperacionalResponseFormatoDto {
//   mesa?: number;
//   comanda?: string;
//   senha?: string;
// }
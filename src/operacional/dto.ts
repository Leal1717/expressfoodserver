import { CanalOrigem, DeliveryStatus, ItemSubitemTipo, PedidoStatus } from "@prisma/client"
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

// -------------------- SUBITEM

export class CreatePedidoItemSubitemDto {
  @IsInt()
  @Type(() => Number)
  subitem_id: number;

  @IsEnum(ItemSubitemTipo)
  tipo: ItemSubitemTipo;

  @IsOptional()
  @IsBoolean()
  removido?: boolean;

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

  @IsOptional()
  @IsString()
  cpf_nota?: string;

  // ── Delivery ──────────────────────────────────────────────────────────────
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  cliente_id?: number;

  @IsOptional()
  @IsEnum(CanalOrigem)
  canal_origem?: CanalOrigem;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  taxa_entrega?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  endereco_entrega_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  zona_entrega_id?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  motoboy_id?: number;

  @IsOptional()
  @IsString()
  pedido_uuid?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePedidoItemDto)
  itens: CreatePedidoItemDto[];
}

// -------------------- ALTERAR STATUS DELIVERY

export class AlterarDeliveryStatusDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus;

  @IsOptional()
  @ValidateIf(o => o.motoboy_id !== null)
  @IsInt()
  @Type(() => Number)
  motoboy_id?: number | null;
}

// -------------------- COMANDA

export class CriarComandaDto {
  @IsOptional()
  @IsString()
  nome?: string;
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

  // Para balcão e delivery — pagar diretamente pelo ID do pedido
  @IsOptional()
  @IsString()
  pedido_id?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  gorjeta?: number;

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

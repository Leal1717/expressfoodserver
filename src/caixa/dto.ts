import { CaixaMovimentacaoTipo } from '@prisma/client';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AbrirCaixaDto {
  @IsInt()
  @Type(() => Number)
  operador_id: number;

  @IsString()
  operador_nome: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  terminal_id?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  valor_abertura: number;

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class MovimentarCaixaDto {
  @IsInt()
  @Type(() => Number)
  caixa_id: number;

  @IsEnum(CaixaMovimentacaoTipo)
  tipo: CaixaMovimentacaoTipo;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  valor: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsInt()
  @Type(() => Number)
  criado_por_id: number;

  @IsString()
  criado_por_nome: string;
}

export class ForcarFecharCaixaDto {
  @IsInt()
  @Type(() => Number)
  fechado_por_id: number;

  @IsString()
  fechado_por_nome: string;
}

export class FecharCaixaDto {
  @IsInt()
  @Type(() => Number)
  caixa_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  valor_contado_dinheiro: number;

  @IsInt()
  @Type(() => Number)
  fechado_por_id: number;

  @IsString()
  fechado_por_nome: string;

  @IsOptional()
  @IsString()
  observacao?: string;
}

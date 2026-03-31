import { IsInt, IsNumber, IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { EstoqueMovimentacaoTipo } from "@prisma/client";

export class MovimentacaoSalvarDto {
  @IsInt()
  @Type(() => Number)
  subitem_id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade: number;

  @IsOptional()
  @IsEnum(EstoqueMovimentacaoTipo)
  tipo?: EstoqueMovimentacaoTipo;

  @IsOptional()
  @IsString()
  referencia?: string | null;
}

export class MovimentacaoUpdateDto {
  @IsUUID()
  id: string;

  @IsInt()
  @Type(() => Number)
  subitem_id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade: number;

  @IsOptional()
  @IsEnum(EstoqueMovimentacaoTipo)
  tipo?: EstoqueMovimentacaoTipo;

  @IsOptional()
  @IsString()
  referencia?: string;
}
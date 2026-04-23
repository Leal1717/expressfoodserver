import {
  IsEnum,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoCartao {
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO',
  PIX = 'PIX',
}

//
// 👉 BASE (reaproveitável)
//
export class BaseTaxaCartaoDto {

  @IsOptional()
  @IsInt()
  bandeira_id?: number;

  @IsEnum(TipoCartao)
  tipo: TipoCartao;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  parcelas?: number;

  @IsInt()
  prazo_recebimento: number // dias (2, 14, 30...): number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  taxa_percentual: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  taxa_fixa?: number;
}

//
// 👉 CREATE taxa (quando já tem provedor)
//
export class CreateTaxaCartaoDto extends BaseTaxaCartaoDto {

  @IsInt()
  provedor_id: number;
}

//
// 👉 CREATE taxa (sem provedor - usado no createComTaxas)
//
export class CreateTaxaCartaoInputDto extends BaseTaxaCartaoDto {}



//
// 👉 UPSERT taxa (usado no update)
//
export class UpsertTaxaCartaoDto extends BaseTaxaCartaoDto {

  @IsOptional()
  @IsInt()
  id?: number;
}


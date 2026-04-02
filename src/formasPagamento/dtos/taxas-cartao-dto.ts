
import { IsEnum, IsInt, Min, Max, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export enum TipoCartao {
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO',
}

export class CreateTaxaCartaoDto {

    @IsInt()
    terminal_id: number;

    @IsInt()
    bandeira_id: number;

    @IsEnum(TipoCartao)
    tipo: TipoCartao;

    @IsInt()
    @Min(1)
    @Max(12)
    parcelas: number;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    taxa_percentual: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    taxa_fixa?: number;
}

export class UpdateTaxaCartaoDto extends PartialType(CreateTaxaCartaoDto) {}
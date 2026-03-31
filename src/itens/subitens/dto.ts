import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UnidadeMedida } from '@prisma/client';

export class SubitemCriarDto {
  @IsString()
  nome: string;

  @IsBoolean()
  controla_estoque: boolean;

  @IsOptional()
  @IsEnum(UnidadeMedida)
  unidade_compra?: UnidadeMedida;

  @IsOptional()
  @IsEnum(UnidadeMedida)
  unidade_venda?: UnidadeMedida;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  fator_conversao?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade_fisica?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  estoque_minimo?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  custo_unitario?: number;
}


export class SubitemUpdateDto {
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsString()
  nome: string;

  @IsBoolean()
  controla_estoque: boolean;

  @IsOptional()
  @IsEnum(UnidadeMedida)
  unidade_compra?: UnidadeMedida;

  @IsOptional()
  @IsEnum(UnidadeMedida)
  unidade_venda?: UnidadeMedida;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  fator_conversao?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade_fisica?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  estoque_minimo?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  custo_unitario?: number;
}



// export class SubitemCriarDto {
//     nome: string; // "Coca";
//     controla_estoque: boolean; // boolean;
//     unidade_compra: string; // "CX";
//     unidade_venda: string; // "UN";
//     fator_conversao: string; // 12;
//     quantidade_fisica?:number;
//     estoque_minimo?: number;
//     custo_unitario?: number;
// }

// export class SubitemUpdateDto {
//     id: number;
//     nome: string; // "Coca";
//     controla_estoque: boolean; // boolean;
//     unidade_compra: string; // "CX";
//     unidade_venda: string; // "UN";
//     fator_conversao: string; // 12;
//     quantidade_fisica?:number;
//     estoque_minimo?: number;
//     custo_unitario?: number;
// }
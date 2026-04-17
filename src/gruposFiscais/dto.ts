import { IsString, IsInt, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarGrupoFiscalDto {
  @IsString()
  nome: string;

  // NCM / CFOP / CEST
  @IsString()
  ncm: string;

  @IsString()
  cfop: string;

  @IsOptional()
  @IsString()
  cest?: string;

  @IsInt()
  @Min(0)
  @Max(8)
  origem: number;

  // ICMS — preenche csosn OU cst_icms dependendo do CRT da empresa
  @IsOptional()
  @IsString()
  csosn?: string;

  @IsOptional()
  @IsString()
  cst_icms?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  aliquota_icms?: number;

  // PIS
  @IsOptional()
  @IsString()
  cst_pis?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  aliquota_pis?: number;

  // COFINS
  @IsOptional()
  @IsString()
  cst_cofins?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  aliquota_cofins?: number;
}

export class AtualizarGrupoFiscalDto extends CriarGrupoFiscalDto {
  @IsInt()
  id: number;
}

//
// 👉 CREATE provedor + taxas

import { Type } from "class-transformer";
import { IsArray, IsInt, IsString, ValidateNested } from "class-validator";
import { CreateTaxaCartaoInputDto, UpsertTaxaCartaoDto } from "./taxas-cartao-dto";

//
export class CreateProvedorComTaxasDto {

  @IsString()
  nome: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaxaCartaoInputDto)
  taxas: CreateTaxaCartaoInputDto[];
}

//
// 👉 UPDATE provedor + taxas
//
export class UpdateProvedorComTaxasDto {

  @IsInt()
  id: number;

  @IsString()
  nome: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertTaxaCartaoDto)
  taxas: UpsertTaxaCartaoDto[];
}
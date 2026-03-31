import { IsInt, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemSubitemTipo } from "@prisma/client"

export class ItemSubitemDto {
  @IsInt()
  @Type(() => Number)
  subitem_id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade: number;

  @IsEnum(ItemSubitemTipo)
  tipo: ItemSubitemTipo;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  preco?: number;
}
export class ComboItemDto {
  @IsInt()
  @Type(() => Number)
  item_id: number;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Type(() => Number)
  quantidade: number;
}
export class CreateItemDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  preco: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classe_id?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemSubitemDto)
  subitens: ItemSubitemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComboItemDto)
  combo_itens?: ComboItemDto[];
}
export class UpdateItemDto {
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  preco: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  classe_id?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemSubitemDto)
  subitens: ItemSubitemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComboItemDto)
  combo_itens?: ComboItemDto[];
}

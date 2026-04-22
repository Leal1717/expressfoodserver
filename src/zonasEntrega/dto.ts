import { IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarZonaEntregaDto {
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    cidade?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    taxa_base?: number;

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    taxa: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    tempo_estimado?: number;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export class AtualizarZonaEntregaDto extends CriarZonaEntregaDto {
    @Type(() => Number)
    @IsInt()
    id: number;
}

export class ImportarZonasDto {
    @IsOptional()
    @IsString()
    cidade?: string;    // cidade padrão do lote (pode ser sobrescrita por zona)

    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    taxa_base?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CriarZonaEntregaDto)
    zonas: CriarZonaEntregaDto[];
}

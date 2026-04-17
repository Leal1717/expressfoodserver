import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarZonaEntregaDto {
    @IsString()
    nome: string; // "Centro", "Água Verde", "Zona Sul"

    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    taxa: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    tempo_estimado?: number; // em minutos

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export class AtualizarZonaEntregaDto extends CriarZonaEntregaDto {
    id: number;
}

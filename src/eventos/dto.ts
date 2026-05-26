import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EventoStatus } from '@prisma/client';

export class CreateEventoDto {
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    descricao?: string;

    @IsString()
    inicio: string;

    @IsString()
    final: string;
}

export class UpdateEventoDto {
    @IsInt()
    @Type(() => Number)
    id: number;

    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    descricao?: string;

    @IsString()
    inicio: string;

    @IsString()
    final: string;

    @IsOptional()
    @IsEnum(EventoStatus)
    status?: EventoStatus;
}

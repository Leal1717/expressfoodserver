import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TerminalTipo } from '@prisma/client';

export class UpdateTerminalLoginDto {
    @IsInt()
    terminal_id:number;

    @IsInt()
    usuario_id:number;
}


export class SalvarTerminalDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEnum(TerminalTipo)
    tipo: TerminalTipo;

    @IsInt()
    @IsOptional()
    provedor_padrao_id?: number;

    @IsString()
    @IsOptional()
    modelo?: string;
}



export class UpdateTerminalDto {
    @IsInt()
    id: number;

    @IsString()
    @IsOptional()
    nome?: string;

    @IsEnum(TerminalTipo)
    @IsOptional()
    tipo?: TerminalTipo;

    @IsInt()
    @IsOptional()
    provedor_padrao_id?: number;

    @IsString()
    @IsOptional()
    modelo?: string;
}
import { IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TerminalTipo } from '@prisma/client';

export class UpdateTerminalLoginDto {
    @IsInt()
    terminal_id: number;

    @IsInt()
    usuario_id: number;
}

export class SalvarTerminalDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsEnum(TerminalTipo)
    tipo: TerminalTipo;

    @IsOptional() @IsString()
    modelo?: string;

    @IsOptional() @IsInt()
    provedor_padrao_id?: number;

    @IsOptional() @IsString()
    img_fundo_url?: string;

    // capabilities
    @IsOptional() @IsBoolean() faz_pagamento?: boolean;
    @IsOptional() @IsBoolean() tem_balcao?: boolean;
    @IsOptional() @IsBoolean() tem_mesa?: boolean;
    @IsOptional() @IsBoolean() tem_comanda?: boolean;
    @IsOptional() @IsBoolean() tem_senha?: boolean;

    // permissions
    @IsOptional() @IsBoolean() pode_abrir_comanda?: boolean;
    @IsOptional() @IsBoolean() pode_abrir_mesa?: boolean;
    @IsOptional() @IsBoolean() pode_dar_desconto?: boolean;
    @IsOptional() @IsBoolean() pode_cancelar_pedido?: boolean;
}

export class UpdateTerminalDto {
    @IsInt()
    id: number;

    @IsOptional() @IsString() @IsNotEmpty()
    nome?: string;

    @IsOptional() @IsEnum(TerminalTipo)
    tipo?: TerminalTipo;

    @IsOptional() @IsString()
    modelo?: string;

    @IsOptional() @IsInt()
    provedor_padrao_id?: number;

    @IsOptional() @IsString()
    img_fundo_url?: string;

    // capabilities
    @IsOptional() @IsBoolean() faz_pagamento?: boolean;
    @IsOptional() @IsBoolean() tem_balcao?: boolean;
    @IsOptional() @IsBoolean() tem_mesa?: boolean;
    @IsOptional() @IsBoolean() tem_comanda?: boolean;
    @IsOptional() @IsBoolean() tem_senha?: boolean;

    // permissions
    @IsOptional() @IsBoolean() pode_abrir_comanda?: boolean;
    @IsOptional() @IsBoolean() pode_abrir_mesa?: boolean;
    @IsOptional() @IsBoolean() pode_dar_desconto?: boolean;
    @IsOptional() @IsBoolean() pode_cancelar_pedido?: boolean;
}
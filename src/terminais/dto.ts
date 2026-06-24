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

    @IsOptional() @IsString()
    mesa_nome?: string;

    // apenas para criar o usuário compartilhado no primeiro terminal CARDAPIO_DIGITAL
    @IsOptional() @IsString()
    usuario_email?: string;

    @IsOptional() @IsString()
    usuario_senha?: string;

    // capabilities
    @IsOptional() @IsBoolean() faz_pagamento?: boolean;
    @IsOptional() @IsBoolean() tem_balcao?: boolean;
    @IsOptional() @IsBoolean() tem_mesa?: boolean;
    @IsOptional() @IsBoolean() tem_comanda?: boolean;
    @IsOptional() @IsBoolean() tem_senha?: boolean;
    @IsOptional() @IsBoolean() tem_ficha?: boolean;
    @IsOptional() @IsBoolean() tem_delivery?: boolean;

    // permissions
    @IsOptional() @IsBoolean() pode_abrir_comanda?: boolean;
    @IsOptional() @IsBoolean() pode_abrir_mesa?: boolean;
    @IsOptional() @IsBoolean() pode_dar_desconto?: boolean;
    @IsOptional() @IsBoolean() pode_cancelar_pedido?: boolean;
    @IsOptional() @IsBoolean() exige_cliente_comanda?: boolean;
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

    @IsOptional() @IsString()
    mesa_nome?: string;

    // capabilities
    @IsOptional() @IsBoolean() faz_pagamento?: boolean;
    @IsOptional() @IsBoolean() tem_balcao?: boolean;
    @IsOptional() @IsBoolean() tem_mesa?: boolean;
    @IsOptional() @IsBoolean() tem_comanda?: boolean;
    @IsOptional() @IsBoolean() tem_senha?: boolean;
    @IsOptional() @IsBoolean() tem_ficha?: boolean;
    @IsOptional() @IsBoolean() tem_delivery?: boolean;

    // permissions
    @IsOptional() @IsBoolean() pode_abrir_comanda?: boolean;
    @IsOptional() @IsBoolean() pode_abrir_mesa?: boolean;
    @IsOptional() @IsBoolean() pode_dar_desconto?: boolean;
    @IsOptional() @IsBoolean() pode_cancelar_pedido?: boolean;
    @IsOptional() @IsBoolean() exige_cliente_comanda?: boolean;
}
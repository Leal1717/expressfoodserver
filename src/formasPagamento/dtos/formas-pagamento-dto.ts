

import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsEnum, IsString, Length } from 'class-validator';

export enum TipoFormaPagamento {
    DINHEIRO = 'DINHEIRO',
    PIX = 'PIX',
    CARTAO_DEBITO = 'CARTAO_DEBITO',
    CARTAO_CREDITO = 'CARTAO_CREDITO',
    VOUCHER = 'VOUCHER',
    OUTRO = 'OUTRO',
}

export class CreateFormaPagamentoDto {
    @IsString()
    @Length(2, 50)
    nome: string;

    @IsEnum(TipoFormaPagamento)
    tipo: TipoFormaPagamento;

    @IsBoolean()
    exige_troco: boolean;

    @IsBoolean()
    permite_parcelamento: boolean;
}


export class UpdateFormaPagamentoDto extends PartialType(CreateFormaPagamentoDto) {}
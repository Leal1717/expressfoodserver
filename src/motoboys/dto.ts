import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CriarMotoboyDto {
    @IsString()
    nome: string;

    @IsString()
    @Length(8, 14)
    telefone: string;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;
}

export class AtualizarMotoboyDto extends CriarMotoboyDto {
    id: number;
}

import { IsBoolean, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarMotoboyDto {
    @IsString()
    nome: string;

    @IsString()
    @Length(8, 14)
    telefone: string;

    @IsOptional()
    @IsBoolean()
    ativo?: boolean;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    usuario_id?: number | null;
}

export class AtualizarMotoboyDto extends CriarMotoboyDto {
    @Type(() => Number)
    @IsInt()
    id: number;
}

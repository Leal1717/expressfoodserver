import { Type } from "class-transformer";
import { IsEnum, IsInt, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ClienteGenero } from "@prisma/client";


export class SalvarEnderecoDto {
    @IsString()
    rua:string;

    @IsString()
    numero:string;

    @IsString()
    cep:string;

    @IsString()
    bairro:string;

    @IsString()
    cidade: string;

    @IsString()
    estado: string;
}

export class AdicionarEnderecoDto extends SalvarEnderecoDto {
    @IsInt()
    cliente_id: number;
}

export class SalvarClienteDto {
    @IsString()
    nome: string;

    @IsString()
    cpf:string;

    @IsString()
    telefone: string;

    @IsOptional()
    @IsEnum(ClienteGenero)
    genero?: ClienteGenero;

    @IsObject()
    @ValidateNested()
    @Type(()=>SalvarEnderecoDto)
    endereco: SalvarEnderecoDto;
}

export class CriarClienteRapidoDto {
    @IsString()
    nome: string;

    @IsOptional()
    @IsString()
    cpf?: string;

    @IsOptional()
    @IsString()
    telefone?: string;

    @IsOptional()
    @IsEnum(ClienteGenero)
    genero?: ClienteGenero;
}

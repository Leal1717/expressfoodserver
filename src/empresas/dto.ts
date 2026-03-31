import { Type } from "class-transformer";
import { IsEmail, IsInt, IsString, Length, MinLength, ValidateNested } from "class-validator";



// ----------------------------------------------------- parte da empresa
export class SalvarEmpresaDadosEmpresaDto {
    @IsString()
    nome_fantasia: string; // "Empresa Segunda";

    @IsString()
    razao_social:  string; // "Segunda em ltda";

    @IsString()
    cnpj: string; //  "00906885000193";

    @IsInt()
    @Type(() => Number)
    plano_id: number;

}

// ----------------------------------------------------- parte do usuario principal
export class SalvarEmpresaDadosUsuarioDto {
    @IsString()
    nome: string; //  "Segundo Leal", 
    
    @IsString()
    senha: string; //  "12345", 
    
    @MinLength(5)
    email: string; //  "leal2@gmail.com", 
    
    @IsString()
    @Length(8, 14)
    telefone: string; //  "41992760145",
}

export class SalvarEmpresaDto {
    // ----------------------------------------------------- parte da empresa
    @ValidateNested()
    @Type(() => SalvarEmpresaDadosEmpresaDto)
    empresa: SalvarEmpresaDadosEmpresaDto
    
    // ----------------------------------------------------- parte do usuario principal
    @ValidateNested()
    @Type(() => SalvarEmpresaDadosUsuarioDto)
    usuario: SalvarEmpresaDadosUsuarioDto
}


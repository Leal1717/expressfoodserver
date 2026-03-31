import { PartialType } from '@nestjs/mapped-types';
import { IsString, Length } from 'class-validator';

export class CreateBandeiraDto {
    @IsString()
    @Length(2, 30)
    nome: string;
}


export class UpdateBandeiraDto extends PartialType(CreateBandeiraDto) {}
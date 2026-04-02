import { Type } from "class-transformer";
import { IsInt, IsNumber } from "class-validator";

export class MesaUpdatePosDto {

    @IsInt()
    @Type(() => Number)
    id: number;

    @IsNumber()
    @Type(() => Number)
    pos_x: number;

    @IsNumber()
    @Type(() => Number)
    pos_y: number;

}
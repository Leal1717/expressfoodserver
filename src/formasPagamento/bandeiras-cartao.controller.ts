import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "src/decorators/role.decorator";
import { BandeirasCartaoService } from "./bandeiras-cartao.service";
import { CreateBandeiraDto, UpdateBandeiraDto } from "./dtos/bandeiras-cartao-dto";

@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller('api/bandeiras-cartao')
export class BandeirasCartaoController {
    constructor(private readonly service: BandeirasCartaoService) {}



    @Get('todos')
    async buscarTodos() {
        return this.service.findAll();
    }

    @Get('id/:id')
    async buscarPorId(
        @Param('id') id: number,
    ) {
        return this.service.findOne(Number(id));
    }

   
}
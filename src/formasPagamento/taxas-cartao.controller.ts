import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "src/decorators/role.decorator";
import { CreateTaxaCartaoDto, UpdateTaxaCartaoDto } from "./dtos/taxas-cartao-dto";
import { TaxasCartaoService } from "./taxas-cartao.service";

@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller('api/taxas-cartao')
export class TaxasCartaoController {
    constructor(private readonly service: TaxasCartaoService) {}

    @Post('salvar')
    async salvar(
        @Body() data: CreateTaxaCartaoDto,
    ) {
        return this.service.create(data);
    }

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

    @Put('update')
    async update(
        @Body() data: UpdateTaxaCartaoDto & { id: number },
    ) {
        return this.service.update(data.id, data);
    }

    @Delete('delete/:id')
    async delete(
        @Param('id') id: number,
    ) {
        return this.service.remove(Number(id));
    }
}
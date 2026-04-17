import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { type ProvedorPagamento, Role } from "@prisma/client";
import { Roles } from "src/decorators/role.decorator";
import { CreateTaxaCartaoDto,  } from "./dtos/taxas-cartao-dto";
import { TaxasCartaoService } from "./taxas-cartao.service";
import { ProvedoresService } from "./provedores.service";
import { CreateProvedorComTaxasDto, UpdateProvedorComTaxasDto } from "./dtos/provedor";

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller('api/provedores')
export class ProvedoresController {
    constructor(private readonly service: ProvedoresService) {}


  @Post('salvar')
    async salvar(
        @Body() data: ProvedorPagamento,
    ) {
        return this.service.create(data);
    }

    @Post('salvar-com-taxas')
    async salvarComTaxas(
        @Body() data: CreateProvedorComTaxasDto,
    ) {
        return this.service.createComTaxas(data);
    }

    @Put('update-com-taxas')
    async updateComTaxas(
        @Body() data: UpdateProvedorComTaxasDto,
    ) {
        return this.service.updateComTaxas(data);
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


    @Delete('delete/:id')
    async delete(
        @Param('id') id: number,
    ) {
        return this.service.delete(Number(id));
    }

}
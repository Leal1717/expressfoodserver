import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "src/decorators/role.decorator";
import { CreateFormaPagamentoDto, UpdateFormaPagamentoDto } from "./dtos/formas-pagamento-dto";
import { FormasPagamentoService } from "./formas-pagamento.service";

@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller('api/formas-pagamento')
export class FormasPagamentoController {
    constructor(private readonly service: FormasPagamentoService) {}

    @Post('salvar')
    async salvar(@Body() data: CreateFormaPagamentoDto) {
        return this.service.create(data);
    }

    @Get('todos')
    async buscarTodos() {
        return this.service.findAll();
    }

    @Get('id/:id')
    async buscarPorId(@Param('id') id: number) {
        return this.service.findOne(Number(id));
    }

    @Put('update')
    async update(@Body() data: UpdateFormaPagamentoDto & { id: number }) {
        return this.service.update(data.id, data);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        return this.service.remove(Number(id));
    }
}
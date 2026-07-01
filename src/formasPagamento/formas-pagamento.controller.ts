import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { Role } from "@prisma/client";
import { Roles } from "src/decorators/role.decorator";
import { FormasPagamentoService } from "./formas-pagamento.service";

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller('api/formas-pagamento')
export class FormasPagamentoController {
    constructor(private readonly service: FormasPagamentoService) {}


    @Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.AUTOATENDIMENTO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE, Role.OPERADOR_COM_FINANCEIRO)
    @Get('todos')
    async buscarTodos() {
        return this.service.findAll();
    }

    @Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.AUTOATENDIMENTO)
    @Get('id/:id')
    async buscarPorId(@Param('id') id: number) {
        return this.service.findOne(Number(id));
    }

    @Put('update-ativo')
    async updateAtivo(@Body() data: { id: number }) {
        return this.service.updateAtivo(data.id);
    }

}
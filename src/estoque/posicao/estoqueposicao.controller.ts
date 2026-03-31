import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { type EstoquePosicao, Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { EstoqueposicaoService } from './estoqueposicao.service';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.OPERADOR_GERAL, Role.OPERADOR_COM_FINANCEIRO)
@Controller("api/estoque/posicao")
export class EstoqueposicaoController {
    constructor(private readonly service : EstoqueposicaoService) {}

    @Post("/salvar")
    salvar(
        @Body() data: EstoquePosicao
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: EstoquePosicao
    ) {
        return this.service.update(data)
    }
    
    @Get("/todos")
    buscarTodos () {
        return this.service.buscarTodos()
    }
    
    @Get("/id/:id")
    buscarPorId (
        @Param('id') id: string,
    ) {
        return this.service.buscarPorId(Number(id))

    }
    
    @Delete("/delete/:id")
    delete (
        @Param('id') id: string,
    ) {
        return this.service.delete(Number(id))

    }

}

import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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
    
    // [PAGINADO] retorna { items, total, page, limit } — aceita ?page=N&limit=N
    @Get("/todos")
    buscarTodos (
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.service.buscarTodos(page ? Number(page) : 1, limit ? Number(limit) : 100)
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

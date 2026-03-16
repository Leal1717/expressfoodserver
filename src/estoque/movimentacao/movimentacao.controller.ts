import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import type { EstoqueMovimentacao } from '@prisma/client';
import { MovimentacaoSalvarDto, MovimentacaoUpdateDto } from './dto';

@Controller("api/estoque/movimentacao")
export class MovimentacaoController {
    constructor(private readonly service : MovimentacaoService) {}
    
    @Post("/salvar")
    salvar(
        @Body() data: MovimentacaoSalvarDto
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: MovimentacaoUpdateDto
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
        return this.service.buscarPorId(id)

    }
    
    @Delete("/delete/:id")
    delete (
        @Param('id') id: string,
    ) {
        return this.service.delete(id)

    }
}

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MovimentacaoService } from './movimentacao.service';
import { Role, type EstoqueMovimentacao } from '@prisma/client';
import { MovimentacaoSalvarDto, MovimentacaoUpdateDto } from './dto';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.OPERADOR_GERAL, Role.OPERADOR_COM_FINANCEIRO)
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

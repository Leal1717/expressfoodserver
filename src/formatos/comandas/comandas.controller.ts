import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ComandasService } from './comandas.service';
import { Role, type Comanda } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/formatos/comandas")
export class ComandasController {
    constructor(private readonly service : ComandasService) {}

    @Post("/salvar")
    salvar(
        @Body() data: Comanda
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: Comanda
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

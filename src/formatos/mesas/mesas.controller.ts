import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { MesasService } from './mesas.service';
import type { Mesa } from '@prisma/client';

@Controller("api/formatos/mesas")
export class MesasController {
    constructor(private readonly service : MesasService) {}

    @Post("/salvar")
    salvar(
        @Body() data: Mesa
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: Mesa
    ) {
        return this.service.update(data)
    }
    
    @Get("/todos")
    buscarTodos () {
        return this.service.buscarTodos()

    }
    
    @Get("/id/:id")
    buscarPorId (
        @Param('id') id: number,
    ) {
        return this.service.buscarPorId(id)

    }
    
    @Delete("/delete/:id")
    delete (
        @Param('id') id: number,
    ) {
        return this.service.delete(id)

    }
}



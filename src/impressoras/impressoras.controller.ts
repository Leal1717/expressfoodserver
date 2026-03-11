import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ImpressorasService } from './impressoras.service';
import type { Impressora } from '@prisma/client';
// import { PlanoEntity } from './planos.entity';

@Controller("api/impressoras")
export class ImpressorasController {

    constructor(private readonly service : ImpressorasService) {}

    @Post("/salvar")
    salvar(
        @Body() data: Impressora
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: Impressora
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
}

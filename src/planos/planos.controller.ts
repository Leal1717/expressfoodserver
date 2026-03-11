import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PlanosService } from './planos.service';
import type { Plano } from '@prisma/client';
// import { PlanoEntity } from './planos.entity';

@Controller("api/planos")
export class PlanosController {

    constructor(private readonly service : PlanosService) {}

    @Post("/salvar")
    salvar(
        @Body() plano: Plano
    ) {
        return this.service.salvar(plano)
    }

    @Put("/update")
    update(
        @Body() data: Plano
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

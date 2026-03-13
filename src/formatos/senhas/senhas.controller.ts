import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SenhasService } from './senhas.service';
import type { Senha } from '@prisma/client';

@Controller("api/formatos/senhas")
export class SenhasController {
    constructor(private readonly service : SenhasService) {}

    @Post("/salvar")
    salvar(
        @Body() data: Senha
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: Senha
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
     
    @Delete("/delete/:numero")
    delete (
        @Param('numero') numero: number,
    ) {
        return this.service.delete(numero)

    }
}


import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import type { Empresa } from '@prisma/client';

@Controller("api/empresas")
export class EmpresasController {
    constructor(private readonly service: EmpresasService) {}

    @Get("id/:id")
    async buscarPorId(
        @Param('id') id:number
    ) {
        return this.service.buscarPorId(id)
    }

    @Get("todos")
    async buscarTodos() {
        return this.service.buscarTodos()
    }

    @Post("salvar")
    async salvar(
        @Body() data: Empresa
    ) {
        return this.service.salvar(data)
    }

    @Put("update")
    async update(
        @Body() data: Empresa
    ) {
        return this.service.update(data)
    }

}

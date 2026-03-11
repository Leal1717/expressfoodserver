import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type {  Subitem, Item } from '@prisma/client';
import { CreateVendaDto } from './dto';
import { VendasService } from './vendas.service';

@Controller("api/vendas")
export class VendasController {
    constructor(private readonly service: VendasService) {}

    @Post("salvar")
    async salvar(
        @Body() data: CreateVendaDto
    ) {
        return this.service.salvar(data)
    }

    @Get("todos")
    async buscarTodos() {
        return this.service.buscarTodos()
    }

    @Get("id/:id")
    async buscarPorId(
        @Param('id') id:number
    ) {
        return this.service.buscarPorId(id)
    }

    @Get("status/:id")
    async alterarStatus(
        @Param('id') id:number,
        @Body('status') status: any
    ) {
        return this.service.alterarStatus(id, status)
    }

}



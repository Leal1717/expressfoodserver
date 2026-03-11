import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import type {  Subitem, Item } from '@prisma/client';
import { ItensService } from './itens.service';
import { CreateItemDto, UpdateItemDto } from './dto';

@Controller("api/itens")
export class ItensController {
    constructor(private readonly service: ItensService) {}

    @Post("salvar")
    async salvar(
        @Body() data: CreateItemDto
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

    @Put("update")
    async update(
        @Body() data: UpdateItemDto        
    ) {
        return this.service.update(data)
    }

    @Delete("delete/:id")
    async delete(
        @Param("id") id: number
    ) {
        return this.service.delete(id)
    }
}

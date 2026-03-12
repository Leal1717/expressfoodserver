
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PromocoesService } from './promocoes.service';
import type { Promocao } from '@prisma/client';

@Controller("api/promocoes")
export class PromocoesController {
    constructor(private service: PromocoesService) {}
        
    @Post("salvar")
    async salvar(
        @Body() data: Promocao
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
        @Body() data: Promocao        
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

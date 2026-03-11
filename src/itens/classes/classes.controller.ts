/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClassesService } from './classes.service';
import type { Classe } from '@prisma/client';

@Controller("api/classes")
export class ClassesController {
    constructor(private readonly service: ClassesService) {}

    @Post("salvar")
    async salvar(
        @Body() data: Classe
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
        @Body() data: Classe        
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

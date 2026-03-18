import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {  Role, type Subitem } from '@prisma/client';
import { SubitensService } from './subitens.service';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/subitens")
export class SubitensController {
    constructor(private readonly service: SubitensService) {}

    @Post("salvar")
    async salvar(
        @Body() data: Subitem
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
        @Body() data: Subitem        
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

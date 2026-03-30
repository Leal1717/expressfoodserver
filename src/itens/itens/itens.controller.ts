import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {  type Subitem, type Item, Role } from '@prisma/client';
import { ItensService } from './itens.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { Roles } from 'src/decorators/role.decorator';


@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
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
    
    @Put("reorder")
    async reorderTask(
        @Body('id') id:any,      
        @Body('index') index:any       
    ) {
        return this.service.reorderTask(id, index)
    }

    @Put("update-ativo/:id")
    async updateAtivo(
        @Param('id') id : string       
    ) {
        return this.service.updateAtivo(Number(id))
    }

    @Delete("delete/:id")
    async delete(
        @Param("id") id: number
    ) {
        return this.service.delete(id)
    }
}

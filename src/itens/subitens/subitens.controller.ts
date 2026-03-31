import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import {  Role, type Subitem } from '@prisma/client';
import { SubitensService } from './subitens.service';
import { Roles } from 'src/decorators/role.decorator';
import { SubitemCriarDto, SubitemUpdateDto } from './dto';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/subitens")
export class SubitensController {
    constructor(private readonly service: SubitensService) {}

    @Post("salvar")
    async salvar(
        @Body() data: SubitemCriarDto
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
        @Body() data: SubitemUpdateDto        
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
    

    @Delete("delete/:id")
    async delete(
        @Param("id") id: number
    ) {
        return this.service.delete(id)
    }
}

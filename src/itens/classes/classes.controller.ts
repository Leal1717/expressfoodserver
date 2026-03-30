import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { Role, type Classe } from '@prisma/client';
import { EmpresaId } from 'src/decorators/empresaid.decorator';
import { TenantService } from 'src/tenant/tenant.service';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
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

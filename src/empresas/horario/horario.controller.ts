/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { Roles } from 'src/decorators/role.decorator';
import { type  HorarioDeFuncionamento, Role } from '@prisma/client';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/empresa/horario")
export class HorarioController {
    constructor (private service: HorarioService) {}


    @Post("/salvar")
    async create(
        @Body() data: HorarioDeFuncionamento
    ) {
        return this.service.create(data)
    }
    
    
    @Put("/udpate")
    async update(
        @Body() data: HorarioDeFuncionamento
    ) {
        return this.service.update(data)
    }
    
    
    @Get("/todos")
    async buscarTodos() {
        return this.service.buscarTodos()
    }
    
    
    @Delete("/delete/:id")
    async delete(
        @Param('id') id: string,
    ) {
        return this.service.delete(Number(id))
    }


}

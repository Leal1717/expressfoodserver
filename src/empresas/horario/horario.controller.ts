

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { HorarioService } from './horario.service';
import { Roles } from 'src/decorators/role.decorator';
import { type  HorarioDeFuncionamento, Role } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/empresa/horario")
export class HorarioController {
    constructor (private service: HorarioService) {}

    /** aqui chamamos de SYNC pq ele faz create, update e delete. Ele pega a lista toda e reatualiza tudo no banco */
    @Post("/sync")
    async create(
        @Body() data: HorarioDeFuncionamento[]
    ) {
        return this.service.sync(data)
    }
    
    
    @Get("/todos")
    async buscarTodos() {
        return this.service.buscarTodos()
    }
    
    @Get("/todos-por-dia")
    async buscarTodosPorDia() {
        return this.service.buscarTodosPorDia()
    }
    
    
    @Delete("/delete/:id")
    async delete(
        @Param('id') id: string,
    ) {
        return this.service.delete(Number(id))
    }


}

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ImpressorasService } from './impressoras.service';
import { Role, type Impressora } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
// import { PlanoEntity } from './planos.entity';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/impressoras")
export class ImpressorasController {

    constructor(private readonly service : ImpressorasService) {}

    @Post("/salvar")
    salvar(
        @Body() data: Impressora
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: Impressora
    ) {
        return this.service.update(data)
    }
    
    @Get("/todos")
    buscarTodos () {
        return this.service.buscarTodos()

    }
    
    @Get("/id/:id")
    buscarPorId (
        @Param('id') id: number,
    ) {
        return this.service.buscarPorId(id)

    }
    
    @Delete("/delete/:id")
    delete (
        @Param('id') id: number,
    ) {
        return this.service.delete(id)

    }
}

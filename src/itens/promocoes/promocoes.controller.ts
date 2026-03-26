
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PromocoesService } from './promocoes.service';
import { Role, type Promocao } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';


@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
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

    @Put("update-ativo/:id")
    async updateAtivo(
        @Param("id") id: number | string      
    ) {
        return this.service.updateAtivo(Number(id))
    }

    @Delete("delete/:id")
    async delete(
        @Param("id") id: number | string
    ) {
        return this.service.delete(Number(id))
    }
    
}

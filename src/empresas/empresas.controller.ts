
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import type { Empresa } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';

@Controller("api/empresas")
export class EmpresasController {
    constructor(private readonly service: EmpresasService) {}

    @Public()
    @Get("id/:id")
    async buscarPorId(
        @Param('id') id:number
    ) {
        return this.service.buscarPorId(id)
    }
    
    @Public()
    @Get("todos")
    async buscarTodos() {
        return this.service.buscarTodos()
    }
    
    @Public()
    @Post("salvar")
    async salvar(
        @Body() data: Empresa
    ) {
        return this.service.salvar(data)
    }
    
    @Public()
    @Put("update")
    async update(
        @Body() data: Empresa
    ) {
        return this.service.update(data)
    }

}

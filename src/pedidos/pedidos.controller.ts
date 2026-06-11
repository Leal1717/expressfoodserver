import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {  type Subitem, type Item, Role } from '@prisma/client';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from 'src/operacional/dto';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.OWNER, Role.ADMIN_GERAL,Role.OPERADOR_COM_FINANCEIRO)
@Controller("api/pedidos")
export class PedidosController {
    constructor(private readonly service: PedidosService) {}

    @Post("salvar")
    async salvar(
        @Body() data: CreatePedidoDto
    ) {
        return this.service.salvar(data)
    }

    
    @Put("status/:id")
    async alterarStatus(
        @Param('id') id: string,
        @Body('status') status: any
    ) {
        return this.service.alterarStatus(id, status)
    }

    
    // [PAGINADO] retorna { items, total, page, limit } — aceita ?page=N&limit=N
    @Get("todos")
    async buscarTodos(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.service.buscarTodos(page ? Number(page) : 1, limit ? Number(limit) : 50)
    }

    @Get("id/:id")
    async buscarPorId(
        @Param('id') id:number
    ) {
        return this.service.buscarPorId(id)
    }



}




import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { Role, type Empresa, type Usuario } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';


@Roles(Role.ADMIN_GERAL,Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/usuarios")
export class UsuariosController {
    constructor(private readonly service: UsuariosService) {}

    @Get("id/:id")
    async buscarPorId(
        @Param('id') id:number
    ) {
        return this.service.buscarPorId(id)
    }

    @Get("todos")
    async buscarTodos() {
        return this.service.buscarTodos()
    }

    @Post("salvar")
    async salvar(
        @Body() data: Usuario
    ) {
        return this.service.salvar(data)
    }

    @Put("update")
    async update(
        @Body() data: Usuario
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

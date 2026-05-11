import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TerminaisService } from './terminais.service';
import { Role, type Terminal } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { SalvarTerminalDto, UpdateTerminalDto, UpdateTerminalLoginDto } from './dto';
// import { PlanoEntity } from './planos.entity';

@Roles(Role.OWNER, Role.ADMIN_GERAL ,Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/terminais")
export class TerminaisController {

    constructor(private readonly service : TerminaisService) {}

    @Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.AUTOATENDIMENTO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE, Role.OPERADOR_COM_FINANCEIRO)
    @Post("/login")
    logar(
        @Body() data: UpdateTerminalLoginDto
    ) {
        return this.service.logar(data)
    }

    @Post("/salvar")
    salvar(
        @Body() data: SalvarTerminalDto
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: UpdateTerminalDto
    ) {
        return this.service.update(data)
    }

    @Patch("/update-ativo/:id")
    updateAtivo(
        @Param('id') id : any
    ) {
        return this.service.updateAtivo(Number(id))
    }
    
    @Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.AUTOATENDIMENTO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE, Role.OPERADOR_COM_FINANCEIRO)
    @Get("/todos")
    buscarTodos () {
        return this.service.buscarTodos()
    }

    @Get("/cardapio-digital/info")
    buscarInfoCardapioDigital() {
        return this.service.buscarInfoCardapioDigital()
    }

    @Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.AUTOATENDIMENTO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE, Role.OPERADOR_COM_FINANCEIRO)
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

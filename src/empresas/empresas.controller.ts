
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { Role, type Empresa } from '@prisma/client';
import { Public } from 'src/decorators/public.decorator';
import { ConfigurarFiscalEmpresaDto, SalvarEmpresaDto } from './dto';
import { Roles } from 'src/decorators/role.decorator';

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

    @Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.AUTOATENDIMENTO, Role.CONTADOR)
    @Get("logada")
    async buscarLogada() {
        return this.service.buscarLogada()
    }
    
    @Public()
    @Get("todos")
    async buscarTodos() {
        return this.service.buscarTodos()
    }
    
    @Public()
    @Post("salvar")
    async salvar(
        @Body() data: SalvarEmpresaDto
    ) {
        return this.service.salvar(data)
    }
    
    @Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.AUTOATENDIMENTO)
    @Put("update")
    async update(
        @Body() data: Empresa
    ) {
        return this.service.update(data)
    }

    @Roles(Role.OWNER, Role.CONTADOR)
    @Put("configurar-fiscal")
    async configurarFiscal(
        @Body() data: ConfigurarFiscalEmpresaDto
    ) {
        return this.service.configurarFiscal(data)
    }

}

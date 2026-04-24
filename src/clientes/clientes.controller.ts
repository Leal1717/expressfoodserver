

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { type Cliente, Role, type Impressora } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { ClientesService } from './clientes.service';
import { AdicionarEnderecoDto, CriarClienteRapidoDto, SalvarClienteDto } from './dto';
// import { PlanoEntity } from './planos.entity';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE, Role.OPERADOR_COM_FINANCEIRO)
@Controller("api/clientes")
export class ClientesController {

    constructor(private readonly service : ClientesService) {}

    @Post("/salvar")
    salvar(
        @Body() data: SalvarClienteDto
    ) {
        return this.service.salvar(data)
    }

    @Post("/criar-rapido")
    criarRapido(@Body() data: CriarClienteRapidoDto) {
        return this.service.criarRapido(data)
    }

    @Get("/cpf/:cpf")
    buscarPorCpf(@Param('cpf') cpf: string) {
        return this.service.buscarPorCpf(cpf)
    }

    @Get("/telefone/:telefone")
    buscarPorTelefone(@Param('telefone') telefone: string) {
        return this.service.buscarPorTelefone(telefone)
    }

    @Put("/update")
    update(
        @Body() data: Cliente
    ) {
        return this.service.update(data)
    }

    @Post("/enderecos/salvar")
    addEndereco(
        @Body() data: AdicionarEnderecoDto
    ){
        return this.service.adicionarEndereco(data)
    }

    @Delete("/enderecos/delete")
    deleteEndereco(
        @Body("cliente_id") cliente_id: number,
        @Body("endereco_id") endereco_id: number
    ) {
        return this.service.removerEndereco(cliente_id, endereco_id)
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


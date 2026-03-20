import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {  type Subitem, type Item, Role } from '@prisma/client';
import { CreatePedidoDto, OperacionalPagarDto, OperacionalPedirContaDto, OperacionalQueryDto } from './dto';
import { OperacionalService } from './operacional.service';
import { MovimentacaoSalvarDto } from 'src/estoque/movimentacao/dto';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.OPERADOR_COM_FINANCEIRO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE)
@Controller("api/operacional")
export class OperacionalController {
    constructor(private readonly service: OperacionalService) {}

    @Post("salvar")
    async salvar(
        @Body() data: CreatePedidoDto
    ) {
        return this.service.inserirPedido(data)
    }


    @Put("conta")
    async conta(
        @Body() data: OperacionalPedirContaDto
    ) {
        return this.service.conta(data)
    }


    @Put("pagar")
    async pagar(
        @Body() data: OperacionalPagarDto
    ) {
        return this.service.pagar(data)
    }




    @Get("query")
    async buscarQuery(
        @Query() query: OperacionalQueryDto
    ) {
        return this.service.buscarQuery(query)
    }

    // ------------------------------------------------------------------------------------------------------------------- formatos

    @Get("formato")
    async buscarPorFormato(
        @Query("tipo") tipo: string
    ) {
        return this.service.buscarPorFormato(tipo)
    }

    @Get("mesas/mapa")
    async mapaDeMesas() {
        return this.service.mapaDeMesas()
    }



    @Get("mesa/:nome")
    async buscarMesa(
        @Param('nome') nome: string
    ) {
        return this.service.buscarMesa(nome)
    }

    @Get("comanda/:nome")
    async buscarComanda(
        @Param('nome') nome: string
    ) {
        return this.service.buscarComanda(nome)
    }

    @Get("senha/:nome")
    async buscarSenha(
        @Param('nome') numero: number
    ) {
        return this.service.buscarSenha(numero)
    }
    

    // ------------------------------------------------------------------------------------------------------------------- cozinha
    @Get("kds")
    async buscarKds(
    ) {
        return this.service.buscarKds()
    }
    



    // ------------------------------------------------------------------------------------------------------------------- estoque

    @Get("estoque/atual")
    async buscarEstoqueAtual(
    ) {
        return this.service.buscarEstoqueAtual()
    }
    
    
    @Get("estoque/subitem/:id")
    async buscarMovimentacaoPorSubitem(
        @Param("id") id: number
    ) {
        return this.service.buscarMovimentacaoPorSubitem(Number(id))
    }
    
    
    @Post("estoque/entrada")
    async darEntradaNoEstoque(
        @Body() data: MovimentacaoSalvarDto
    ) {
        return this.service.movimentarEstoque(data)
    }
    

}
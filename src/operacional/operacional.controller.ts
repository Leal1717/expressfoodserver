import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import type {  Subitem, Item } from '@prisma/client';
import { CreatePedidoDto, OperacionalPagarDto, OperacionalPedirContaDto, OperacionalQueryDto } from './dto';
import { OperacionalService } from './operacional.service';

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



    @Get("formato")
    async buscarPorFormato(
        @Query("tipo") tipo: string
    ) {
        return this.service.buscarPorFormato(tipo)
    }



    @Get("query")
    async buscarQuery(
        @Query() query: OperacionalQueryDto
    ) {
        return this.service.buscarQuery(query)
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
    

    @Get("kds")
    async buscarKds(
    ) {
        return this.service.buscarKds()
    }
    

}
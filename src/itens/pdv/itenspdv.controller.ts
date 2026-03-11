import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ItensPdvService } from './itenspdv.service';

@Controller("api/itenspdv")
export class ItensPdvController {
    constructor(private readonly service: ItensPdvService) {}


    @Get("itens")
    async buscarProdutos() {
        return this.service.buscarProdutos()
    }

    @Get("classes")
    async buscarEmClassess() {
        return this.service.buscarEmClasses()
    }

}

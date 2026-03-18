import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ItensPdvService } from './itenspdv.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';


@Roles(Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
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

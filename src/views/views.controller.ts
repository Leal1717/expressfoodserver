
import { Controller, Get, Render } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { ItensPdvService } from 'src/itens/pdv/itenspdv.service';

@Public()
@Controller()
export class ViewsController {
    constructor(
        // private readonly pdv: ItensPdvService
    ) {}

    @Get("login")
    @Render("login/login")
    async login() {
        // const dados = await this.pdv.buscarEmClasses()
        return {}
    }

    @Get("cardapio/classes")
    @Render("carrinho/classes")
    async cardapioClasses() {
        return {}
    }

    @Get("cardapio/classe/itens")
    @Render("mesas/mesas")
    async paginaMesas() {
        return {}
    }

    @Get("carrinho/itens")
    @Render("carrinho/carrinho")
    async paginaCarrinho() {
        return {}
    }
}






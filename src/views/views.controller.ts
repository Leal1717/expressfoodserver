
import { Controller, Get, Render } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';

@Public()
@Controller("web")
export class ViewsController {

    @Get("cardapio")
    @Render("itens/cardapio")
    cardapio() {
        return {}
    }
}






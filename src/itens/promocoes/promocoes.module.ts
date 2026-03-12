import { PromocoesController } from './promocoes.controller';
import { PromocoesService } from './promocoes.service';

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [PromocoesController,],
    providers: [PromocoesService,],
})
export class PromocoesModule { }

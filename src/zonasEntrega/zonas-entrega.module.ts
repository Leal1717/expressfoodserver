import { Module } from '@nestjs/common';
import { ZonasEntregaController } from './zonas-entrega.controller';
import { ZonasEntregaService } from './zonas-entrega.service';

@Module({
    controllers: [ZonasEntregaController],
    providers: [ZonasEntregaService],
})
export class ZonasEntregaModule {}

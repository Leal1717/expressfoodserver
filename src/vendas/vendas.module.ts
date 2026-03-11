
import { Module } from '@nestjs/common';
import { VendasController } from './vendas.controller';
import { VendasService } from './vendas.service';

@Module({
    imports: [],
    controllers: [VendasController],
    providers: [VendasService],
})
export class VendasModule {}

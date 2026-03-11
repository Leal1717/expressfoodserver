
import { Module } from '@nestjs/common';
import { ItensController } from './itens.controller';
import { ItensService } from './itens.service';

@Module({
    imports: [],
    controllers: [ItensController],
    providers: [ItensService],
})
export class ItensModule {}


import { Module } from '@nestjs/common';
import { SubitensController } from './subitens.controller';
import { SubitensService } from './subitens.service';

@Module({
    imports: [],
    controllers: [SubitensController],
    providers: [SubitensService],
})
export class SubitensModule {}

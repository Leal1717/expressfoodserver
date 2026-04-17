import { Module } from '@nestjs/common';
import { MotoboyController } from './motoboys.controller';
import { MotoboyService } from './motoboys.service';

@Module({
    controllers: [MotoboyController],
    providers: [MotoboyService],
})
export class MotoboyModule {}

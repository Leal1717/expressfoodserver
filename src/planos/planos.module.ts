import { PlanosController } from './planos.controller';
import { PlanosService } from './planos.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    // imports: [TypeOrmModule.forFeature([PlanoEntity])],
    controllers: [
        PlanosController,],
    providers: [
        PlanosService,],
})
export class PlanosModule { }

import { ImpressorasController } from './impressoras.controller';
import { ImpressorasService } from './impressoras.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    // imports: [TypeOrmModule.forFeature([PlanoEntity])],
    controllers: [
        ImpressorasController,],
    providers: [
        ImpressorasService,],
})
export class ImpressorasModule { }

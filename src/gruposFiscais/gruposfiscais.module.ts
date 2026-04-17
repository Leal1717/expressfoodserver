import { Module } from '@nestjs/common';
import { GruposfiscaisController } from './gruposfiscais.controller';
import { GruposfiscaisService } from './gruposfiscais.service';

@Module({
    controllers: [GruposfiscaisController],
    providers: [GruposfiscaisService],
})
export class GruposfiscaisModule {}

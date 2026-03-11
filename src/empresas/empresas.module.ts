/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';

@Module({
    imports: [],
    controllers: [EmpresasController],
    providers: [EmpresasService],
})
export class EmpresasModule {}

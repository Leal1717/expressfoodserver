import { TerminaisController } from './terminais.controller';
import { TerminaisService } from './terminais.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    controllers: [
        TerminaisController,],
    providers: [
        TerminaisService,],
})
export class TerminaisModule { }

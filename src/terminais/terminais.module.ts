import { TerminaisController } from './terminais.controller';
import { TerminaisService } from './terminais.service';

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TenantModule } from 'src/tenant/tenant.module';

@Module({
    imports: [PrismaModule, TenantModule],
    controllers: [TerminaisController],
    providers: [TerminaisService],
})
export class TerminaisModule { }

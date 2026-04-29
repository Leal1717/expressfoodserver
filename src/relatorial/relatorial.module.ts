/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { RelatorialController } from './relatorial.controller';
import { RelatorialService } from './relatorial.service';

@Module({
    imports: [PrismaModule, TenantModule],
    controllers: [RelatorialController],
    providers: [RelatorialService],
})
export class RelatorialModule {}

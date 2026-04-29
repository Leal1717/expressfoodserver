import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { KdsController } from './kds.controller';
import { KdsService } from './kds.service';

@Module({
    imports: [PrismaModule, TenantModule],
    controllers: [KdsController],
    providers: [KdsService],
})
export class KdsModule {}

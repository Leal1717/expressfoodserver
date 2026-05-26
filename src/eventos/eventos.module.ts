import { Module } from '@nestjs/common';
import { OciModule } from 'src/oci/oci.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { EventosController } from './eventos.controller';
import { EventosService } from './eventos.service';

@Module({
    imports: [OciModule, TenantModule],
    controllers: [EventosController],
    providers: [EventosService],
})
export class EventosModule {}

import { Module } from '@nestjs/common';
import { OciModule } from 'src/oci/oci.module';
import { TenantModule } from 'src/tenant/tenant.module';
import { ItensController } from './itens.controller';
import { ItensService } from './itens.service';

@Module({
    imports: [OciModule, TenantModule],
    controllers: [ItensController],
    providers: [ItensService],
})
export class ItensModule {}

import { Global, Module } from '@nestjs/common';
import { TenantService } from './tenant.service';

@Global()
@Module({
    imports: [],
    controllers: [],
    exports: [TenantService],
    providers: [TenantService],
})
export class TenantModule {}

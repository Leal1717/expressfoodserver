import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { prismaTenantExtension } from 'src/tenant/prisma-tentant-extension';
import { TenantService } from 'src/tenant/tenant.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    readonly tenantClient;

    constructor(private readonly tenantService: TenantService){
        super()
        this.tenantClient = this.$extends(prismaTenantExtension(this.tenantService))
    }

    async onModuleInit() {
        await this.$connect()
    }

    async onModuleDestroy() {
        await this.$disconnect()
    }
}

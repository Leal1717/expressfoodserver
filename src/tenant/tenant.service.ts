/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export interface TenantStore {
    empresaId: string;
}

@Injectable()
export class TenantService {
    private static readonly als = new AsyncLocalStorage<TenantStore>();


    get empresaId():string {
        const store = TenantService.als.getStore()
        if (!store) {
            throw new Error("Falha do contexto do Tenant no TenantService")
        }
        return store.empresaId;
    }

    get storage() {
        return TenantService.als;
    }
}

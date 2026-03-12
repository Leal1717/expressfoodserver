
import { Prisma } from "@prisma/client";
import { TenantService } from "./tenant.service";

export const prismaTenantExtension = (tenantService: TenantService) => {
    return Prisma.defineExtension({
        query: {
            $allModels: {
                async $allOperations({ model, operation, args, query }) {
                    // 1. Tenta pegar o ID, se não tiver (ex: rota pública), segue a query normal
                    let empresaId: string;
                    try {
                        empresaId = tenantService.empresaId;
                    } catch {
                        return query(args);
                    }

                    // 2. Fazemos o cast para 'any' para o TS parar de reclamar das propriedades
                    const anyArgs = args as any;

                    // Operações que usam "where"
                    if (['findMany', 'findFirst', 'findUnique', 'update', 'updateMany', 'delete', 'deleteMany', 'count'].includes(operation)) {
                        anyArgs.where = { ...anyArgs.where, empresa_id: empresaId };
                    }

                    // Operações de criação (data)
                    if (operation === 'create') {
                        anyArgs.data = { ...anyArgs.data, empresa_id: empresaId };
                    }

                    if (operation === 'createMany') {
                        if (Array.isArray(anyArgs.data)) {
                            anyArgs.data = anyArgs.data.map((item: any) => ({...item,empresa_id: empresaId,}));
                        } else if (anyArgs.data) {
                            anyArgs.data.empresa_id = empresaId;
                        }
                    }

                return query(anyArgs);
                },
            },
        },
    });
};
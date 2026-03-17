import { EstoqueMovimentacaoTipo } from "@prisma/client";

export class MovimentacaoSalvarDto {
    subitem_id: number;
    quantidade: number
    tipo?: EstoqueMovimentacaoTipo;
    referencia?: string | null;
}

export class MovimentacaoUpdateDto {
    id: string;
    subitem_id: number;
    tipo?: EstoqueMovimentacaoTipo;
    quantidade: number
    referencia?: string;
}


export class SubitemCriarDto {
    nome: string; // "Coca";
    controla_estoque: boolean; // boolean;
    unidade_compra: string; // "CX";
    unidade_venda: string; // "UN";
    fator_conversao: string; // 12;
    quantidade_fisica?:number;
    estoque_minimo?: number;
    custo_unitario?: number;
}

export class SubitemUpdateDto {
    id: number;
    nome: string; // "Coca";
    controla_estoque: boolean; // boolean;
    unidade_compra: string; // "CX";
    unidade_venda: string; // "UN";
    fator_conversao: string; // 12;
    quantidade_fisica?:number;
    estoque_minimo?: number;
    custo_unitario?: number;
}
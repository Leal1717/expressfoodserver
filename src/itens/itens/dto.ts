import { ItemSubitemTipo } from "@prisma/client"

export class CreateItemDto {
    nome: string
    descricao?: string
    preco: number
    empresa_id: number
    classe_id?: number



    subitens: {
        subitem_id: number
        quantidade: number
        tipo: ItemSubitemTipo
        preco?: number
    }[]

    combo_itens?: { item_id: number; quantidade: number }[]; // novos


}

export class UpdateItemDto {
    id: number
    nome: string
    descricao?: string
    preco: number
    classe_id?: number

    subitens: {
        subitem_id: number
        quantidade: number
        tipo: ItemSubitemTipo
        preco?: number
    }[]

    
    combo_itens?: { item_id: number; quantidade: number }[]; // novos
}
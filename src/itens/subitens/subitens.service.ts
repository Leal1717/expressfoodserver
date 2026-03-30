import { Injectable } from '@nestjs/common';
import { Classe, Subitem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubitemCriarDto, SubitemUpdateDto } from './dto';

@Injectable()
export class SubitensService {
    constructor(private prisma: PrismaService) {}

    toEntity() {}
    
    /**
     * Quando criamos um item vmos se ele controla estgoque. Se sim, ja criamos uma linhja pra esse subitem na tabela estoeu-posicao e ja criamos 
     * uma movimentcao de stoque na tabela estoque-movimentacao como se estivesse dando a primeira esntrada de estoque
     */
    async salvar(data:SubitemCriarDto) {
        const subitem = await this.prisma.tenantClient.subitem.create({data: { 
            nome: data.nome,
            controla_estoque: data.controla_estoque,
            fator_conversao: data.fator_conversao,
            unidade_compra: data.unidade_compra,
            unidade_venda: data.unidade_venda
         }})
        let estoque_posicao: any = {}
        let estoque_movimentacao: any = {}
        if (data.controla_estoque) {
            const estoque = await this.estoque(subitem.id, data.estoque_minimo!, data.custo_unitario!, data.quantidade_fisica!)
            estoque_posicao = estoque.posicao
            estoque_movimentacao = estoque.movimentacao
        }
        return {subitem, estoque_posicao, estoque_movimentacao}
    }


    /**
     * Alem de dar um update comum, vai verificar se por acaso esse item nao comecou agora a controlar estoque. Caso sim, 
     * vai fazer as operacoes iniciais de estoque igual na funcao salvar
     */
    async update(data:SubitemUpdateDto) {
        const subitem = await this.prisma.tenantClient.subitem.findUnique({where: {id: Number(data.id)}})
        let estoque_posicao: any = {}
        let estoque_movimentacao: any = {}
        if (!subitem.controla_estoque && data.controla_estoque) {
            const estoque = await this.estoque(subitem.id, data.estoque_minimo!, data.custo_unitario!, data.quantidade_fisica!)
            estoque_posicao = estoque.posicao
            estoque_movimentacao = estoque.movimentacao
        } 
        if (subitem.controla_estoque) {
            await this.prisma.tenantClient.estoquePosicao.update({ 
                where: { subitem_id: subitem.id },    
                data: {
                    estoque_minimo: data.estoque_minimo,
                    custo_unitario: data.custo_unitario,
                }})
        }
        const updated = await  this.prisma.tenantClient.subitem.update({where: {id: Number(data.id)}, data: {
            nome: data.nome,
            controla_estoque: data.controla_estoque,
            fator_conversao: data.fator_conversao,
            unidade_compra: data.unidade_compra,
            unidade_venda: data.unidade_venda
        }})
        return {subitem: updated, estoque_posicao, estoque_movimentacao}
    }




    
    async buscarTodos() {
        return this.prisma.tenantClient.subitem.findMany()
    }


    

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.subitem.findUnique({where: {id: Number(id)}})
    }




    async delete(id:number) {
        return this.prisma.tenantClient.subitem.delete({where: {id: Number(id)}})
    }




    /**
     * reordena este item e ja reordena todos os outros itens baseado no INDEX
     */
    async reorderTask(id: number, newIndex: number) {
        // 1. Buscar o item atual para saber a posição antiga
        const taskToMove = await this.prisma.tenantClient.subitem.findUnique({ where: { id } });
        if (taskToMove) {

            const oldIndex = taskToMove.index;
                
            if (oldIndex === newIndex) return taskToMove;

            return this.prisma.tenantClient.$transaction(async (tx) => {
                if (newIndex > oldIndex) {
                    // Movendo para baixo: decrementa quem está no caminho
                    await tx.subitem.updateMany({
                        where: {index: { gt: oldIndex, lte: newIndex },},
                        data: { index: { decrement: 1 } },
                    });
                } else {
                    // Movendo para cima: incrementa quem está no caminho
                    await tx.subitem.updateMany({
                        where: {index: { gte: newIndex, lt: oldIndex },},
                        data: { index: { increment: 1 } },
                    });
                }

                // 2. Atualizar o item movido para a posição final
                return tx.subitem.update({
                    where: { id },
                    data: { index: newIndex },
                });
            });
        }
    }

    // ----------------------------------------------------------------------------------------------------------------------------------- OPERACOES DE ESTOQUE

    /**
     * Caso no salvar o item tenha controla_estoque como true OU no update verificamos que antes era false e mudou pra true
     */
    private async estoque(subitemId:number, estoque_minimo:number,custo_unitario:number,quantidade_fisica:number) {
          const posicao = await this.prisma.tenantClient.estoquePosicao.create({
                data: {
                    subitem_id: subitemId,
                    estoque_minimo: estoque_minimo,
                    custo_unitario: custo_unitario,
                    quantidade_fisica: quantidade_fisica,
                }
            })

            const movimentacao = await this.prisma.tenantClient.estoqueMovimentacao.create({
                data: {
                    custo_unitario_momento: custo_unitario,
                    quantidade: quantidade_fisica,
                    subitem_id: subitemId,
                    tipo: "ENTRADA"
                }
            })
        return { posicao, movimentacao }    
    }
    
}

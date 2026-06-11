import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AlterarDeliveryStatusDto, CriarComandaDto, CreatePedidoDto, OperacionalPagarDto, OperacionalPedirContaDto, OperacionalQueryDto } from './dto';
import { OperacionalService } from './operacional.service';
import { MovimentacaoSalvarDto } from 'src/estoque/movimentacao/dto';
import { Roles } from 'src/decorators/role.decorator';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO, Role.OPERADOR_COM_FINANCEIRO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE, Role.AUTOATENDIMENTO)
@Controller("api/operacional")
export class OperacionalController {
    constructor(private readonly service: OperacionalService) {}

    @Post("salvar")
    async salvar(
        @Body() data: CreatePedidoDto
    ) {
        return this.service.inserirPedido(data)
    }


    @Put("conta")
    async conta(
        @Body() data: OperacionalPedirContaDto
    ) {
        return this.service.conta(data)
    }


    @Put("pagar")
    async pagar(
        @Body() data: OperacionalPagarDto
    ) {
        return this.service.pagar(data)
    }




    @Get("query")
    async buscarQuery(
        @Query() query: OperacionalQueryDto
    ) {
        return this.service.buscarQuery(query)
    }

    // ------------------------------------------------------------------------------------------------------------------- formatos

    // [PAGINADO] retorna { items, total, page, limit } — aceita ?page=N&limit=N
    @Get("formato")
    async buscarPorFormato(
        @Query("tipo") tipo: string,
        @Query("desde") desde?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.service.buscarPorFormato(tipo, desde, page ? Number(page) : 1, limit ? Number(limit) : 50)
    }

    @Get("mesas/mapa")
    async mapaDeMesas() {
        return this.service.mapaDeMesas()
    }



    @Get("mesa/:nome")
    async buscarMesa(
        @Param('nome') nome: string
    ) {
        return this.service.buscarMesa(nome)
    }

    // ------------------------------------------------------------------------------------------------------------------- comanda

    @Post("comandas/salvar")
    async criarComanda(
        @Body() data: CriarComandaDto,
    ) {
        return this.service.criarComanda(data)
    }

    @Get("comandas/todos")
    async listarComandasAtivas() {
        return this.service.listarComandasAtivas()
    }

    @Get("comandas/id/:id")
    async buscarComanda(
        @Param('id') id: string
    ) {
        return this.service.buscarComanda(id)
    }

    @Get("comandas/nfc/:uid")
    async buscarComandaPorNfc(
        @Param('uid') uid: string,
    ) {
        return this.service.buscarComandaPorNfc(uid)
    }

    @Delete("comandas/delete/:id")
    async cancelarComanda(
        @Param('id') id: string,
    ) {
        return this.service.cancelarComanda(id)
    }

    
    // ------------------------------------------------------------------------------------------------------------------- senha

    @Get("senha/:nome")
    async buscarSenha(
        @Param('nome') numero: number
    ) {
        return this.service.buscarSenha(numero)
    }

    @Put("senha/:numero/pronta")
    async toggleSenhaPronta(
        @Param('numero') numero: number,
        @Body('pronta') pronta: boolean,
    ) {
        return this.service.setSenhaPronta(Number(numero), pronta)
    }
    

    // ------------------------------------------------------------------------------------------------------------------- cozinha
    @Get("kds")
    async buscarKds() {
        return this.service.buscarKds()
    }

    @Put("delivery/:pedidoId/status")
    async alterarStatusDelivery(
        @Param("pedidoId") pedidoId: string,
        @Body() data: AlterarDeliveryStatusDto,
    ) {
        return this.service.alterarStatusDelivery(pedidoId, data)
    }
    



    // ------------------------------------------------------------------------------------------------------------------- estoque

    @Get("estoque/atual")
    async buscarEstoqueAtual(
    ) {
        return this.service.buscarMovimentacaoAtual()
    }
    
    
    @Get("estoque/subitem/:id")
    async buscarMovimentacaoPorSubitem(
        @Param("id") id: number
    ) {
        return this.service.buscarMovimentacaoPorSubitem(Number(id))
    }
    
    
    @Post("estoque/entrada")
    async darEntradaNoEstoque(
        @Body() data: MovimentacaoSalvarDto
    ) {
        return this.service.movimentarEstoque(data)
    }
    

}
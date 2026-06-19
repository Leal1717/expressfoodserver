import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Roles } from 'src/decorators/role.decorator'
import { AtualizarOcorrenciaDto, CriarRotaDto, NaoEntregarDto } from './dto'
import { RotasService } from './rotas.service'

const ADMIN_ROLES = [
    Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO,
    Role.OPERADOR_COM_FINANCEIRO, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE,
] as const

@Roles(...ADMIN_ROLES)
@Controller('api/rotas')
export class RotasController {
    constructor(private readonly service: RotasService) {}

    @Post('criar')
    criar(@Body() data: CriarRotaDto) {
        return this.service.criar(data)
    }

    @Get('todos')
    todos(@Query('status') status?: string) {
        return this.service.todos(status)
    }

    @Get('id/:id')
    buscarPorId(@Param('id') id: string) {
        return this.service.buscarPorId(Number(id))
    }

    @Roles(...ADMIN_ROLES, Role.MOTOBOY)
    @Put(':rotaId/pedido/:pedidoId/entregar')
    entregarPedido(
        @Param('rotaId') rotaId: string,
        @Param('pedidoId') pedidoId: string,
    ) {
        return this.service.entregarPedido(Number(rotaId), pedidoId)
    }

    @Delete(':id/cancelar')
    cancelar(@Param('id') id: string) {
        return this.service.cancelar(Number(id))
    }

    // ── Endpoints do terminal motoboy ─────────────────────────────────────────

    @Roles(...ADMIN_ROLES, Role.MOTOBOY)
    @Get('minha-rota')
    minhaRota(@Req() req: any) {
        return this.service.minhaRota(req.user.usuario_id)
    }

    @Roles(...ADMIN_ROLES, Role.MOTOBOY)
    @Put(':rotaId/pedido/:pedidoId/nao-entregar')
    naoEntregarPedido(
        @Param('rotaId') rotaId: string,
        @Param('pedidoId') pedidoId: string,
        @Body() dto: NaoEntregarDto,
    ) {
        return this.service.naoEntregarPedido(Number(rotaId), pedidoId, dto.motivo)
    }

    @Roles(...ADMIN_ROLES, Role.MOTOBOY)
    @Put(':rotaId/ocorrencia')
    atualizarOcorrencia(
        @Param('rotaId') rotaId: string,
        @Body() dto: AtualizarOcorrenciaDto,
    ) {
        return this.service.atualizarOcorrencia(Number(rotaId), dto.tipo, dto.descricao)
    }
}

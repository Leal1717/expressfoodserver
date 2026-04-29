import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ProducaoStatus, Role } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { Roles } from 'src/decorators/role.decorator';
import { KdsService } from './kds.service';

class AtualizarProducaoStatusDto {
    @IsEnum(ProducaoStatus)
    status: ProducaoStatus;
}

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.OPERADOR_GERAL, Role.OPERADOR_SEM_ESTOQUE, Role.OPERADOR_COM_FINANCEIRO)
@Controller('api/kds')
export class KdsController {
    constructor(private readonly service: KdsService) {}

    @Get()
    buscarPedidos() {
        return this.service.buscarPedidos()
    }

    @Put(':id/status')
    atualizarStatus(
        @Param('id') id: string,
        @Body() dto: AtualizarProducaoStatusDto,
    ) {
        return this.service.atualizarStatus(id, dto.status)
    }
}

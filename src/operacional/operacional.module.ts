
import { Module } from '@nestjs/common';
import { OperacionalController } from './operacional.controller';
import { OperacionalService } from './operacional.service';
import { MesasService } from 'src/formatos/mesas/mesas.service';
import { ComandasService } from 'src/formatos/comandas/comandas.service';
import { PedidosService } from 'src/pedidos/pedidos.service';
import { SenhasService } from 'src/formatos/senhas/senhas.service';

@Module({
    imports: [],
    controllers: [OperacionalController],
    providers: [OperacionalService, ComandasService, MesasService, SenhasService, PedidosService],
})
export class OperacionalModule {}

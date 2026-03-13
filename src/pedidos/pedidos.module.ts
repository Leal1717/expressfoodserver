
import { Module } from '@nestjs/common';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';
import { MesasService } from 'src/formatos/mesas/mesas.service';
import { ComandasService } from 'src/formatos/comandas/comandas.service';

@Module({
    imports: [],
    controllers: [PedidosController],
    providers: [PedidosService],
})
export class PedidosModule {}

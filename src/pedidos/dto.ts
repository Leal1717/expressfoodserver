import { PedidoStatus,  } from "@prisma/client"



// filtros de busca
export class PedidoQueryDto {
  status?: PedidoStatus;
  usuario?: number;
  mesa?: number;
  comanda?: string;
  senha?: string;
}
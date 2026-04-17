import { Module } from "@nestjs/common";
import { FormasPagamentoController } from "./formas-pagamento.controller";
import { BandeirasCartaoController } from "./bandeiras-cartao.controller";
import { TaxasCartaoController } from "./taxas-cartao.controller";
import { FormasPagamentoService } from "./formas-pagamento.service";
import { BandeirasCartaoService } from "./bandeiras-cartao.service";
import { TaxasCartaoService } from "./taxas-cartao.service";
import { ProvedoresService } from "./provedores.service";
import { ProvedoresController } from "./provedores.controller";


@Module({
  controllers: [
    FormasPagamentoController,
    BandeirasCartaoController,
    TaxasCartaoController,
    ProvedoresController,
  ],
  providers: [
    FormasPagamentoService,
    BandeirasCartaoService,
    TaxasCartaoService,
    ProvedoresService,
  ],
  exports: [
    FormasPagamentoService,
    TaxasCartaoService, // útil pro fluxo de pagamento depois
    ProvedoresService,
  ],
})
export class FormasPagamentoModule {}
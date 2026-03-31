import { Module } from "@nestjs/common";
import { FormasPagamentoController } from "./formas-pagamento.controller";
import { BandeirasCartaoController } from "./bandeiras-cartao.controller";
import { TaxasCartaoController } from "./taxas-cartao.controller";
import { FormasPagamentoService } from "./formas-pagamento.service";
import { BandeirasCartaoService } from "./bandeiras-cartao.service";
import { TaxasCartaoService } from "./taxas-cartao.service";


@Module({
  controllers: [
    FormasPagamentoController,
    BandeirasCartaoController,
    TaxasCartaoController,
  ],
  providers: [
    FormasPagamentoService,
    BandeirasCartaoService,
    TaxasCartaoService,
  ],
  exports: [
    FormasPagamentoService,
    TaxasCartaoService, // útil pro fluxo de pagamento depois
  ],
})
export class FormasPagamentoModule {}
import { KdsModule } from './kds/kds.module';
import { OciModule } from './oci/oci.module';
import { ImagensController } from './oci/imagens.controller';
import { LocaisModule } from './locais/locais.module';
import { LocaisService } from './locais/locais.service';
import { LocaisController } from './locais/locais.controller';
import { ZonasEntregaModule } from './zonasEntrega/zonas-entrega.module';
import { ZonasEntregaController } from './zonasEntrega/zonas-entrega.controller';
import { ZonasEntregaService } from './zonasEntrega/zonas-entrega.service';
import { MotoboyModule } from './motoboys/motoboys.module';
import { MotoboyController } from './motoboys/motoboys.controller';
import { MotoboyService } from './motoboys/motoboys.service';
import { GruposfiscaisModule } from './gruposFiscais/gruposfiscais.module';
import { GruposfiscaisController } from './gruposFiscais/gruposfiscais.controller';
import { GruposfiscaisService } from './gruposFiscais/gruposfiscais.service';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesController } from './clientes/clientes.controller';
import { ClientesService } from './clientes/clientes.service';
import { BandeirasCartaoController } from './formasPagamento/bandeiras-cartao.controller';
import { TaxasCartaoController } from './formasPagamento/taxas-cartao.controller';
import { FormasPagamentoController } from './formasPagamento/formas-pagamento.controller';
import { BandeirasCartaoService } from './formasPagamento/bandeiras-cartao.service';
import { TaxasCartaoService } from './formasPagamento/taxas-cartao.service';
import { FormasPagamentoService } from './formasPagamento/formas-pagamento.service';
import { HorarioModule } from './empresas/horario/horario.module';
import { HorarioController } from './empresas/horario/horario.controller';
import { HorarioService } from './empresas/horario/horario.service';
import { EstoqueposicaoModule } from './estoque/posicao/estoqueposicao.module';
import { EstoqueposicaoController } from './estoque/posicao/estoqueposicao.controller';
import { EstoqueposicaoService } from './estoque/posicao/estoqueposicao.service';
import { ViewsModule } from './views/views.module';
import { ViewsController } from './views/views.controller';
import { RelatorialModule } from './relatorial/relatorial.module';
import { RelatorialController } from './relatorial/relatorial.controller';
import { RelatorialService } from './relatorial/relatorial.service';
import { MovimentacaoModule } from './estoque/movimentacao/movimentacao.module';
import { MovimentacaoController } from './estoque/movimentacao/movimentacao.controller';
import { MovimentacaoService } from './estoque/movimentacao/movimentacao.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaClientValidationException } from './prisma/exception.filter';
import { SenhasModule } from './formatos/senhas/senhas.module';
import { SenhasController } from './formatos/senhas/senhas.controller';
import { SenhasService } from './formatos/senhas/senhas.service';
import { ComandasModule } from './formatos/comandas/comandas.module';
import { ComandasController } from './formatos/comandas/comandas.controller';
import { ComandasService } from './formatos/comandas/comandas.service';
import { MesasModule } from './formatos/mesas/mesas.module';
import { MesasController } from './formatos/mesas/mesas.controller';
import { MesasService } from './formatos/mesas/mesas.service';
import { PromocoesModule } from './itens/promocoes/promocoes.module';
import { TenantModule } from './tenant/tenant.module';
import { TenantService } from './tenant/tenant.service';
import { ClassesModule } from './itens/classes/classes.module';
import { ClassesService } from './itens/classes/classes.service';
import { ClassesController } from './itens/classes/classes.controller';
import { EmpresasController } from './empresas/empresas.controller';
import { EmpresasService } from './empresas/empresas.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
// import { PlanosModule } from './planos/planos.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlanosModule } from './planos/planos.module';
import { EmpresasModule } from './empresas/empresas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SubitensModule } from './itens/subitens/subitens.module';
import { ItensModule } from './itens/itens/itens.module';
import { ItensPdvModule } from './itens/pdv/itenspdv.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ImpressorasModule } from './impressoras/impressoras.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { TenantMiddleware } from './tenant/tenant.middleware';
import { OperacionalModule } from './operacional/operacional.module';
import { CaixaModule } from './caixa/caixa.module';
import { TerminaisModule } from './terminais/terminais.module';
import { SessionService } from './auth/session.service';
import { LoggerMiddleware } from './logger/logger.middleware';
import { ProvedoresService } from './formasPagamento/provedores.service';
import { ProvedoresController } from './formasPagamento/provedores.controller';
import { MercadoPagoOAuthModule } from '../integracoes/mercadopago/mercadopago-oauth.module';
import { EventosModule } from './eventos/eventos.module';

@Module({
	imports: [
		KdsModule,
		OciModule,
		LocaisModule,
		ZonasEntregaModule,
		MotoboyModule,
		GruposfiscaisModule,
		ClientesModule,

		JwtModule.register({
			global: true,
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1day' },
		}),
		AuthModule,
		HorarioModule,
		EstoqueposicaoModule,
		ViewsModule,
		RelatorialModule,
		MovimentacaoModule,
		SenhasModule,
		ComandasModule,
		MesasModule,
		PromocoesModule,
		TenantModule,
		ClassesModule,
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true }),
		UsuariosModule,
		PlanosModule,
		EmpresasModule,
		ImpressorasModule,
		TerminaisModule,
		SubitensModule,
		ItensModule,
		ItensPdvModule,
		PedidosModule,
		OperacionalModule,
		CaixaModule,
		MercadoPagoOAuthModule,
		EventosModule,
	],
	controllers: [
		ZonasEntregaController,
		MotoboyController,
		GruposfiscaisController,
		ClientesController,
		BandeirasCartaoController,
		TaxasCartaoController,
		ProvedoresController,
		FormasPagamentoController,
		HorarioController,
		EstoqueposicaoController,
		ViewsController,
		RelatorialController,
		MovimentacaoController,
		SenhasController,
		ComandasController,
		MesasController,
		ClassesController, EmpresasController, LocaisController, ImagensController],
	providers: [
		LocaisService,
		ZonasEntregaService,
		MotoboyService,
		GruposfiscaisService,
		ClientesService,
		BandeirasCartaoService,
		TaxasCartaoService,
		ProvedoresService,
		FormasPagamentoService,
		HorarioService,
		EstoqueposicaoService,
		RelatorialService,
		MovimentacaoService,
		{
			provide: APP_FILTER,
			useClass: PrismaClientExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: PrismaClientValidationException,
		},
		SenhasService,
		ComandasService,
		MesasService,
		TenantService,
		{ provide: APP_GUARD, useClass: AuthGuard },
		ClassesService, EmpresasService, PrismaService],
})


export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//logger - pra dev aqui
		consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })

		// tenant - para pegar o id da empresa em cada request
		consumer.apply(TenantMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}

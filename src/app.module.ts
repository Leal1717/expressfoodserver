import { ClassesModule } from './itens/classes/classes.module';
import { ClassesService } from './itens/classes/classes.service';
import { ClassesController } from './itens/classes/classes.controller';
import { EmpresasController } from './empresas/empresas.controller';
import { EmpresasService } from './empresas/empresas.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
// import { PlanosModule } from './planos/planos.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlanosModule } from './planos/planos.module';
import { EmpresasModule } from './empresas/empresas.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { SubitensModule } from './itens/subitens/subitens.module';
import { ItensModule } from './itens/itens/itens.module';
import { ItensPdvModule } from './itens/pdv/itenspdv.module';
import { VendasModule } from './vendas/vendas.module';
import { ImpressorasModule } from './impressoras/impressoras.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		 JwtModule.register({
			global: true,
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '60s' },
		}),
		AuthModule,
		ClassesModule,
		PrismaModule,
		ConfigModule.forRoot({ isGlobal: true }),
		UsuariosModule,
		PlanosModule,
		EmpresasModule,
		ImpressorasModule,
		SubitensModule,
		ItensModule,
		ItensPdvModule,
		VendasModule,
	],
	controllers: [
		ClassesController, EmpresasController],
	providers: [
		ClassesService, EmpresasService, PrismaService],
})
export class AppModule { }

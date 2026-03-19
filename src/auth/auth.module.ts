import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { SessionService } from './session.service';

@Module({
  imports: [],
  controllers: [AuthController],
  exports: [SessionService],
  providers: [AuthService, UsuariosService, SessionService]
})
export class AuthModule {}

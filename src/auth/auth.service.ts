import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { SignInDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsuariosService, private jwtService : JwtService, private session: SessionService) {}

    async signIn(data:SignInDto) {
        const user = await this.userService.buscarPorEmail(data.username)
        if (user?.senha !== data.senha) {
            throw new UnauthorizedException()
        }

        const  {senha, ...result} = user;
 
        const sessionId = crypto.randomUUID();
        this.session.setSession(user.id, sessionId)

        
        
        const payload = { sub: user.id, sid:sessionId, usuario_id: user.id, usuario_email: user.email, empresa_id: user.empresa_id, role: user.role };

        return {
            // 💡 Here the JWT secret key that's used for signing the payload 
            // is the key that was passsed in the JwtModule
            access_token: await this.jwtService.signAsync(payload),
        }
    }
}

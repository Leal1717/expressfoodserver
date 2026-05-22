import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { SignInDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ROLE_TERMINAL_MAP } from './role-terminal-map';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsuariosService,
        private jwtService: JwtService,
        private session: SessionService,
        private prisma: PrismaService,
    ) {}

    async signIn(data: SignInDto) {
        const user = await this.userService.buscarPorEmail(data.email)
        if (user?.senha !== data.senha) {
            throw new UnauthorizedException()
        }

        const { senha, ...result } = user;

        const sessionId = crypto.randomUUID();
        await this.session.setSession(user.id, sessionId)

        const payload = { sub: user.id, sid: sessionId, usuario_id: user.id, usuario_email: user.email, empresa_id: user.empresa_id, role: user.role };

        const tiposPermitidos = ROLE_TERMINAL_MAP[user.role];
        const terminais = await this.prisma.terminal.findMany({
            where: {
                empresa_id: user.empresa_id,
                ativo: true,
                tipo: { in: tiposPermitidos },
            },
            select: {
                    id:                   true,
                    nome:                 true,
                    tipo:                 true,
                    modelo:               true,
                    faz_pagamento:        true,
                    tem_balcao:           true,
                    tem_mesa:             true,
                    tem_comanda:          true,
                    tem_senha:            true,
                    pode_abrir_comanda:   true,
                    pode_abrir_mesa:      true,
                    pode_cancelar_pedido: true,
                    pode_dar_desconto:    true,
                },
        });

        return {
            access_token: await this.jwtService.signAsync(payload),
            usuario: result,
            terminais,
        };
    }
}

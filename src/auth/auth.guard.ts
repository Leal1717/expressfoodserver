
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private reflector: Reflector, private session: SessionService) {}


    async canActivate(context: ExecutionContext): Promise<boolean> {
		
		// primeiro vamos resolver o decorator @isPublic()
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass()
		])
		if (isPublic) {
			return true;
		}




		// agora caso nao seja @isPublic()
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request)
		if (!token) {
			throw new UnauthorizedException()
		}

		try {
			const payload = await this.jwtService.verifyAsync(token)
			request['user'] = payload
		} catch (error) {
			throw new UnauthorizedException()
		}





		// primeiro vamos resolver o decorator @Roles()
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass() 
		])
		if (!requiredRoles) return true; // Se a rota não tem @Roles, é pública

		// se tem ROLES entao checar
		const user = request['user'];
		const hasRole = requiredRoles.some((role) => user.role === role);

		if (!hasRole) {
			throw new ForbiddenException('Você não tem permissão para acessar este recurso');
		}


		
		// vamos checar a sessa (se nao logou duas vezes ao mesmo tempo)
		const currentSid = this.session.getSession(user.sub)
		if (!currentSid || currentSid != user.sid) {
			throw new ForbiddenException('Sessão expirada ou logada em outro terminal.')
		}
		return true

    }


	private extractTokenFromHeader(request: Request) : string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? []
		return type == 'Bearer' ? token : undefined;
	}
}

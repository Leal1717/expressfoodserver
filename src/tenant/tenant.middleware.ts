import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { TenantService } from './tenant.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TenantMiddleware implements NestMiddleware {

    constructor(private readonly tenantService: TenantService, private readonly jwtService: JwtService) {}

    use(req: Request, res: Response, next: Function) {
        const authHeader = req.headers.authorization
        if (!authHeader) return next()
        
        const token = authHeader.split(" ")[1]
        try {
            const payload = this.jwtService.decode(token)
            const empresa_id:any = payload?.empresa_id
            if (empresa_id) {
                this.tenantService.storage.run({empresaId: empresa_id}, () => next())
            } else {
                next()
            }
        
        } catch (error) {
            next();
        }
    }
}

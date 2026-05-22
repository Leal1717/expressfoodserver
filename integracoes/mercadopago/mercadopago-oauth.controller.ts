import { Controller, Delete, Get, Query, Res } from '@nestjs/common';
import { Role } from '@prisma/client';
import express from 'express';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { MercadoPagoOAuthService } from './mercadopago-oauth.service';

@Controller('api/mercadopago/oauth')
export class MercadoPagoOAuthController {
  constructor(private readonly service: MercadoPagoOAuthService) {}

  @Roles(Role.OWNER, Role.ADMIN_GERAL)
  @Get('connect')
  gerarUrl() {
    return this.service.gerarUrlConexao();
  }

  @Public()
  @Get('callback')
  async callback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: express.Response,
  ) {
    try {
      await this.service.handleCallback(code, state);
      return res.redirect(process.env.MP_FRONTEND_SUCCESS_URL ?? '/');
    } catch {
      return res.redirect(process.env.MP_FRONTEND_ERROR_URL ?? '/');
    }
  }

  @Roles(Role.OWNER, Role.ADMIN_GERAL)
  @Get('status')
  getStatus() {
    return this.service.getStatus();
  }

  @Roles(Role.OWNER, Role.ADMIN_GERAL)
  @Delete('disconnect')
  desconectar() {
    return this.service.desconectar();
  }
}

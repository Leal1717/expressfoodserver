import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';
import { MpStatusResponse, MpTokenResponse } from './dtos/mercadopago-oauth.dto';
import type { MercadoPagoCredencial } from '@prisma/client';

@Injectable()
export class MercadoPagoOAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantService: TenantService,
  ) {}

  gerarUrlConexao(): { url: string } {
    const empresaId = this.tenantService.empresaId;
    const state = Buffer.from(String(empresaId)).toString('base64');

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.MP_APP_ID ?? '',
      redirect_uri: process.env.MP_REDIRECT_URI ?? '',
      state,
    });

    return {
      url: `https://auth.mercadopago.com/authorization?${params.toString()}`,
    };
  }

  async handleCallback(code: string, state: string): Promise<void> {
    const empresaId = parseInt(Buffer.from(state, 'base64').toString('utf-8'), 10);

    if (isNaN(empresaId)) {
      throw new BadRequestException('State OAuth inválido');
    }

    const tokenData = await this.trocarCodePorToken(code);
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    await this.prisma.mercadoPagoCredencial.upsert({
      where: { empresa_id: empresaId },
      create: {
        empresa_id: empresaId,
        mp_user_id: String(tokenData.user_id),
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        public_key: tokenData.public_key,
        expires_at: expiresAt,
        live_mode: tokenData.live_mode,
        scope: tokenData.scope,
      },
      update: {
        mp_user_id: String(tokenData.user_id),
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        public_key: tokenData.public_key,
        expires_at: expiresAt,
        live_mode: tokenData.live_mode,
        scope: tokenData.scope,
      },
    });
  }

  async getStatus(): Promise<MpStatusResponse> {
    const empresaId = Number(this.tenantService.empresaId);

    const credencial = await this.prisma.mercadoPagoCredencial.findUnique({
      where: { empresa_id: empresaId },
    });

    if (!credencial) {
      return { connected: false };
    }

    return {
      connected: true,
      live_mode: credencial.live_mode,
      mp_user_id: credencial.mp_user_id,
      expires_at: credencial.expires_at,
      scope: credencial.scope ?? undefined,
    };
  }

  async desconectar(): Promise<{ ok: boolean }> {
    const empresaId = Number(this.tenantService.empresaId);

    await this.prisma.mercadoPagoCredencial.deleteMany({
      where: { empresa_id: empresaId },
    });

    return { ok: true };
  }

  async refreshIfExpired(empresaId: number): Promise<MercadoPagoCredencial> {
    const credencial = await this.prisma.mercadoPagoCredencial.findUnique({
      where: { empresa_id: empresaId },
    });

    if (!credencial) {
      throw new BadRequestException('Conta MercadoPago não conectada para este tenant');
    }

    const cincoCincoMinutos = 5 * 60 * 1000;
    const tokenAindaValido = credencial.expires_at.getTime() - Date.now() > cincoCincoMinutos;

    if (tokenAindaValido) {
      return credencial;
    }

    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.MP_APP_ID,
        client_secret: process.env.MP_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: credencial.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new ServiceUnavailableException('Falha ao renovar token MercadoPago');
    }

    const tokenData: MpTokenResponse = await response.json();
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    return this.prisma.mercadoPagoCredencial.update({
      where: { empresa_id: empresaId },
      data: {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt,
      },
    });
  }

  private async trocarCodePorToken(code: string): Promise<MpTokenResponse> {
    const response = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.MP_APP_ID,
        client_secret: process.env.MP_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.MP_REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => ({}));
      throw new ServiceUnavailableException(
        `MercadoPago: ${(erro as any).message ?? 'Erro ao obter token'}`,
      );
    }

    return response.json();
  }
}

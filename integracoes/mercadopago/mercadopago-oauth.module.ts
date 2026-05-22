import { Module } from '@nestjs/common';
import { MercadoPagoOAuthController } from './mercadopago-oauth.controller';
import { MercadoPagoOAuthService } from './mercadopago-oauth.service';

@Module({
  controllers: [MercadoPagoOAuthController],
  providers: [MercadoPagoOAuthService],
  exports: [MercadoPagoOAuthService],
})
export class MercadoPagoOAuthModule {}

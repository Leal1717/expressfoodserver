import { IsString } from 'class-validator';

export class MpCallbackQueryDto {
  @IsString()
  code: string;

  @IsString()
  state: string;
}

export interface MpTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  user_id: number;
  refresh_token: string;
  public_key: string;
  live_mode: boolean;
}

export interface MpStatusResponse {
  connected: boolean;
  live_mode?: boolean;
  mp_user_id?: string;
  expires_at?: Date;
  scope?: string;
}

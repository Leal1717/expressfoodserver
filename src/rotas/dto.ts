import { IsArray, IsInt, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'
import { MotivoNaoEntrega, OcorrenciaTipo } from '@prisma/client'

export class CriarRotaDto {
  @IsInt()
  @Type(() => Number)
  motoboy_id: number

  @IsArray()
  @IsString({ each: true })
  pedido_ids: string[]
}

export class NaoEntregarDto {
  motivo: MotivoNaoEntrega
}

export class AtualizarOcorrenciaDto {
  tipo: OcorrenciaTipo | null

  @IsOptional()
  @IsString()
  descricao?: string
}

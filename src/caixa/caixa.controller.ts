import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { CaixaService } from './caixa.service';
import { AbrirCaixaDto, FecharCaixaDto, ForcarFecharCaixaDto, MovimentarCaixaDto } from './dto';

@Roles(
  Role.OWNER,
  Role.ADMIN_GERAL,
  Role.ADMIN_SEM_FINANCEIRO,
  Role.OPERADOR_COM_FINANCEIRO,
  Role.OPERADOR_GERAL,
)
@Controller('api/caixa')
export class CaixaController {
  constructor(private readonly service: CaixaService) {}

  @Post('abrir')
  abrir(@Body() dto: AbrirCaixaDto) {
    return this.service.abrir(dto);
  }

  @Post('movimentar')
  movimentar(@Body() dto: MovimentarCaixaDto) {
    return this.service.movimentar(dto);
  }

  @Put('fechar')
  fechar(@Body() dto: FecharCaixaDto) {
    return this.service.fechar(dto);
  }

  @Put(':id/forcar-fechamento')
  forcarFechar(@Param('id') id: string, @Body() dto: ForcarFecharCaixaDto) {
    return this.service.forcarFechar(Number(id), dto);
  }

  @Get('aberto')
  buscarAberto(@Query('terminal_id') terminalId?: string) {
    return this.service.buscarAberto(terminalId ? Number(terminalId) : undefined);
  }

  @Get('resumo/:id')
  resumo(@Param('id') id: string) {
    return this.service.resumo(Number(id));
  }

  @Get('todos')
  listar(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listar(page ? Number(page) : 1, limit ? Number(limit) : 20);
  }
}

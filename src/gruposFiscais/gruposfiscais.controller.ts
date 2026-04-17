import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { GruposfiscaisService } from './gruposfiscais.service';
import { AtualizarGrupoFiscalDto, CriarGrupoFiscalDto } from './dto';

@Roles(Role.OWNER, Role.ADMIN_GERAL)
@Controller('api/grupos-fiscais')
export class GruposfiscaisController {
    constructor(private readonly service: GruposfiscaisService) {}

    @Post('salvar')
    salvar(@Body() data: CriarGrupoFiscalDto) {
        return this.service.create(data);
    }

    @Get('todos')
    buscarTodos() {
        return this.service.findAll();
    }

    @Get('id/:id')
    buscarPorId(@Param('id') id: number) {
        return this.service.findOne(Number(id));
    }

    @Put('update')
    update(@Body() data: AtualizarGrupoFiscalDto) {
        return this.service.update(data);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        return this.service.remove(Number(id));
    }
}

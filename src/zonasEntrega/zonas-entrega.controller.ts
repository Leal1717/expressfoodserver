import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { ZonasEntregaService } from './zonas-entrega.service';
import { AtualizarZonaEntregaDto, CriarZonaEntregaDto, ImportarZonasDto } from './dto';

@Roles(Role.OWNER, Role.ADMIN_GERAL)
@Controller('api/zonas-entrega')
export class ZonasEntregaController {
    constructor(private readonly service: ZonasEntregaService) {}

    @Post('salvar')
    salvar(@Body() data: CriarZonaEntregaDto) {
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
    update(@Body() data: AtualizarZonaEntregaDto) {
        return this.service.update(data);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        return this.service.remove(Number(id));
    }

    @Put('taxa-base')
    atualizarTaxaBase(@Body('taxa_base') taxa_base: number) {
        return this.service.atualizarTaxaBase(Number(taxa_base));
    }

    @Post('importar')
    importar(@Body() data: ImportarZonasDto) {
        return this.service.importar(data);
    }
}

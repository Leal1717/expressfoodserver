import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role, EventoStatus } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { EventosService } from './eventos.service';
import { CreateEventoDto, UpdateEventoDto } from './dto';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller('api/eventos')
export class EventosController {
    constructor(private readonly service: EventosService) {}

    @Post('salvar')
    async salvar(@Body() data: CreateEventoDto) {
        return this.service.salvar(data);
    }

    @Get('todos')
    async buscarTodos() {
        return this.service.buscarTodos();
    }

    @Get('id/:id')
    async buscarPorId(@Param('id') id: number) {
        return this.service.buscarPorId(id);
    }

    @Put('update')
    async update(@Body() data: UpdateEventoDto) {
        return this.service.update(data);
    }

    @Put('update-status/:id')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: EventoStatus,
    ) {
        return this.service.updateStatus(Number(id), status);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: number) {
        return this.service.delete(id);
    }
}

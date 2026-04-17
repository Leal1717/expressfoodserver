import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { MotoboyService } from './motoboys.service';
import { AtualizarMotoboyDto, CriarMotoboyDto } from './dto';

@Roles(Role.OWNER, Role.ADMIN_GERAL)
@Controller('api/motoboys')
export class MotoboyController {
    constructor(private readonly service: MotoboyService) {}

    @Post('salvar')
    salvar(@Body() data: CriarMotoboyDto) {
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
    update(@Body() data: AtualizarMotoboyDto) {
        return this.service.update(data);
    }

    @Delete('delete/:id')
    delete(@Param('id') id: number) {
        return this.service.remove(Number(id));
    }
}

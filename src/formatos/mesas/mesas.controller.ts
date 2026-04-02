import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { Role, type Mesa } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { MesaUpdatePosDto } from './dto';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.ADMIN_SEM_FINANCEIRO)
@Controller("api/formatos/mesas")
export class MesasController {
    constructor(private readonly service : MesasService) {}

    @Post("/salvar")
    salvar(
        @Body() data: Mesa
    ) {
        return this.service.salvar(data)
    }

    @Put("/update")
    update(
        @Body() data: Mesa
    ) {
        return this.service.update(data)
    }

    @Patch("/layout")
    updatePosicionamento(
        @Body('mesas') mesas: MesaUpdatePosDto[]
    ) {
        return this.service.updatePosicionamento(mesas)
    }
    
    @Get("/todos")
    buscarTodos () {
        return this.service.buscarTodos()

    }
    
    @Get("/id/:id")
    buscarPorId (
        @Param('id') id: number,
    ) {
        return this.service.buscarPorId(id)

    }
    
    @Delete("/delete/:id")
    delete (
        @Param('id') id: number,
    ) {
        return this.service.delete(id)

    }
}




[
    {
        "id": 1,
        "nome": "Mesa 1",
        "empresa_id": 2,
        "pos_x": null,
        "pos_y": null,
        "status": "LIVRE",
        "updated_at": "2026-04-02T19:56:55.611Z",
        "posicao_x": 3.218525775818473,
        "posicao_y": 4.955242676684132
    },
    {
        "id": 2,
        "nome": "Mesa 2",
        "empresa_id": 2,
        "pos_x": null,
        "pos_y": null,
        "status": "LIVRE",
        "updated_at": "2026-04-02T19:57:05.707Z",
        "posicao_x": 3.231422523027347,
        "posicao_y": 19.767023475801697
    },
    {
        "id": 3,
        "nome": "Mesa 3",
        "empresa_id": 2,
        "pos_x": null,
        "pos_y": null,
        "status": "LIVRE",
        "updated_at": "2026-04-02T19:57:13.805Z",
        "posicao_x": 25.59178393743991,
        "posicao_y": 46.821050025117486
    },
    {
        "id": 4,
        "nome": "Mesa 4",
        "empresa_id": 2,
        "pos_x": null,
        "pos_y": null,
        "status": "LIVRE",
        "updated_at": "2026-04-02T19:57:17.994Z",
        "posicao_x": 42.61803338462376,
        "posicao_y": 12.881631902028435
    }
]
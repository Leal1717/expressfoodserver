
import { Controller, Get, Query } from '@nestjs/common';
import { RelatorialService } from './relatorial.service';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';

@Roles(Role.OWNER, Role.ADMIN_GERAL, Role.OPERADOR_COM_FINANCEIRO)
@Controller("api/relatorial")
export class RelatorialController { 
    constructor(private service: RelatorialService) {}

    @Get("geral")
    geral(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarTotalizador(new Date(inicio), new Date(fim))
    }


    @Get("diario")
    buscarDiario(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarDiario(new Date(inicio), new Date(fim))
    }

    @Get("semanal")
    buscarSemanal(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarSemanal(new Date(inicio), new Date(fim))
    }

    @Get("mensal")
    buscarMensal(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarMensal(new Date(inicio), new Date(fim))
    }

    @Get("classes")
    buscarClasses(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarClasses(new Date(inicio), new Date(fim))
    }

    @Get("itens")
    buscarItens(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarItens(new Date(inicio), new Date(fim))
    }
    
    @Get("subitens")
    buscarSubitens(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarSubitens(new Date(inicio), new Date(fim))
    }

    @Get("itens/todos")
    buscarTodosItens(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarTodosItens(new Date(inicio), new Date(fim))
    }

    @Get("operadores")
    buscarOperadores(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarPorUsuario(new Date(inicio), new Date(fim))
    }

    @Get("terminais")
    buscarTerminais(
        @Query("inicio") inicio: string,
        @Query("fim") fim: string,
    ) {
        return this.service.buscarPorTerminal(new Date(inicio), new Date(fim))
    }
}

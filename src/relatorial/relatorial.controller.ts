
import { Controller, Get, Query } from '@nestjs/common';
import { RelatorialService } from './relatorial.service';

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
}

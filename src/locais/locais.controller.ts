import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { LocaisService } from './locais.service';

@Controller('api/locais')
export class LocaisController {
    constructor(private readonly service: LocaisService) {}

    @Get('municipios')
    buscarMunicipios(@Query('estado') estado: string) {
        if (!estado) throw new BadRequestException('Parâmetro "estado" é obrigatório. Ex: ?estado=PR');
        return this.service.buscarMunicipiosPorEstado(estado);
    }

    @Get('bairros')
    buscarBairros(
        @Query('cidade') cidade: string,
        @Query('estado') estado?: string,
    ) {
        if (!cidade) throw new BadRequestException('Parâmetro "cidade" é obrigatório. Ex: ?cidade=Curitiba');
        const resultados = this.service.buscarBairrosPorCidade(cidade, estado);
        if (!resultados.length) throw new BadRequestException(`Cidade "${cidade}" não encontrada.`);
        // se só um resultado, retorna direto sem o wrapper de array
        return resultados.length === 1 ? resultados[0] : resultados;
    }
}

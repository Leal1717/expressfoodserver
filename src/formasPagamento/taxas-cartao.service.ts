/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaxaCartaoDto,  } from './dtos/taxas-cartao-dto';
import { TipoCartao } from '@prisma/client';

@Injectable()
export class TaxasCartaoService {
    constructor(private prisma: PrismaService) {}


   
    async create(data: CreateTaxaCartaoDto) {
        if (data.tipo === TipoCartao.DEBITO && data.parcelas > 1) {
            throw new BadRequestException('Débito não pode ter parcelas');
        }
        
        const exists = await this.prisma.tenantClient.taxaCartao.findFirst({
            where: {
                provedor_id: data.provedor_id,
                bandeira_id: data.bandeira_id,
                tipo: data.tipo,
                parcelas: data.parcelas,
            },
        });

        if (exists) {
            throw new BadRequestException(`Taxa já cadastrada para esse provedor (bandeira ${data.bandeira_id}, tipo ${data.tipo}, parcelas ${data.parcelas})`);
        }

        const provedorExists = await this.prisma.tenantClient.provedorPagamento.findFirst({
            where: { id: data.provedor_id }
        });

        if (!provedorExists) {
            throw new BadRequestException('Provedor não cadastrado');
        }

        return this.prisma.tenantClient.taxaCartao.create({data});
    }


    findAll() {
        return this.prisma.tenantClient.taxaCartao.findMany({
            include: {
                bandeira: true,
                provedor: true,
            },
        });
    }


    findOne(id: number) {
        return this.prisma.tenantClient.taxaCartao.findFirst({
            where: { id },
            include: {
                bandeira: true,
                provedor: true,
            },
        });
    }

    update(id: number, data: any) {
        return this.prisma.tenantClient.taxaCartao.update({
            where: { id },
            data,
        });
    }

    remove(id: number) {
        return this.prisma.tenantClient.taxaCartao.delete({
            where: { id },
        });
    }
}
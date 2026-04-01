/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaxaCartaoDto, UpdateTaxaCartaoDto } from './dtos/taxas-cartao-dto';

@Injectable()
export class TaxasCartaoService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateTaxaCartaoDto) {
        const exists = await this.prisma.tenantClient.taxaCartao.findFirst({
            where: {
                terminal_id: data.terminal_id,
                bandeira_id: data.bandeira_id,
                tipo: data.tipo,
                parcelas: data.parcelas,
            },
        });

        if (exists) {
            throw new BadRequestException('Taxa já cadastrada');
        }

        const terminalExists = await this.prisma.tenantClient.terminal.findFirst({where: { id: data.terminal_id } })
        console.log(terminalExists)
        if (!terminalExists) {
            throw new BadRequestException('Terminal nao cadastrado');

        }

        return this.prisma.tenantClient.taxaCartao.create({
            data,
        });
    }

    findAll() {
        return this.prisma.tenantClient.taxaCartao.findMany({
            include: {
                bandeira: true,
                terminal: true,
            },
        });
    }

    findOne(id: number) {
        return this.prisma.tenantClient.taxaCartao.findFirst({
            where: { id },
        });
    }

    update(id: number, data: UpdateTaxaCartaoDto) {
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
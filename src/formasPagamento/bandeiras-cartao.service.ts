/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBandeiraDto, UpdateBandeiraDto } from './dtos/bandeiras-cartao-dto';


@Injectable()
export class BandeirasCartaoService {
    constructor(private prisma: PrismaService) {}


    findAll() {
        return this.prisma.bandeira.findMany({
            orderBy: { nome: 'asc' },
        });
    }

    findOne(id: number) {
        return this.prisma.bandeira.findFirst({
            where: { id },
        });
    }

   
}
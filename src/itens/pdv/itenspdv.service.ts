import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItensPdvService {
    constructor(private prisma: PrismaService) {}

    async buscarProdutos() {
        return this.prisma.tenantClient.item.findMany({include: {classe:true, subitens: true,  promocao:{where: {ativo: true}}}})
    }

    async buscarEmClasses() {
        const classes = await this.prisma.tenantClient.classe.findMany({include: {item: {include:{subitens: true, promocao:{where: {ativo: true}}, combos_as_combo: {include: {item: true}}}}}})
        return  classes
    }

}

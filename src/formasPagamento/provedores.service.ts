/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaxaCartaoDto,  } from './dtos/taxas-cartao-dto';
import { ProvedorPagamento, TipoCartao } from '@prisma/client';
import { CreateProvedorComTaxasDto, UpdateProvedorComTaxasDto } from './dtos/provedor';

@Injectable()
export class ProvedoresService {
    constructor(private prisma: PrismaService) {}

    create(data: ProvedorPagamento) {
        return this.prisma.provedorPagamento.create({data: data});
    }





     private normalizeNome(nome: string) {
            return nome
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
        }
    
    
        async createComTaxas(data: CreateProvedorComTaxasDto) {
            console.log(data)
            return this.prisma.tenantClient.$transaction(async (tx) => {
    
                const nomeNormalizado = this.normalizeNome(data.nome);
    
                // 🔥 evitar duplicar provedor
                const exists = await tx.provedorPagamento.findFirst({where: { nome_normalizado: nomeNormalizado }});
                if (exists) {throw new BadRequestException('Provedor já cadastrado');}
    
                // 1. cria provedor
                const provedor = await tx.provedorPagamento.create({data: {nome: data.nome,nome_normalizado: nomeNormalizado,},});
    
                // 2. valida duplicados no payload
                const seen = new Set();
    
                for (const taxa of data.taxas) {
                    const key = `${taxa.bandeira_id}-${taxa.tipo}-${taxa.parcelas}`;
                    if (seen.has(key)) {
                        throw new BadRequestException(`Duplicado no envio: bandeira ${taxa.bandeira_id}, tipo ${taxa.tipo}, parcelas ${taxa.parcelas}`);
                    }
                    seen.add(key);
                }
    
                // 3. cria taxas
                if (data.taxas?.length) {
                    await tx.taxaCartao.createMany({
                        data: data.taxas.map(t => ({...t, provedor_id: provedor.id })),
                    });
                }
    
                return provedor;
            });
        }
    

    async updateComTaxas(data: UpdateProvedorComTaxasDto) {
        console.log(data)
        return this.prisma.tenantClient.$transaction(async (tx) => {

            const nomeNormalizado = this.normalizeNome(data.nome);

            // 1. valida duplicidade de nome
            const nomeExistente = await tx.provedorPagamento.findFirst({
                where: {
                    nome_normalizado: nomeNormalizado,
                    NOT: { id: data.id }
                }
            });

            if (nomeExistente) {
                throw new BadRequestException('Já existe outro provedor com esse nome');
            }

            // 2. atualiza provedor
            await tx.provedorPagamento.update({
                where: { id: data.id },
                data: {
                    nome: data.nome,
                    nome_normalizado: nomeNormalizado
                }
            });

            // 3. valida duplicados no payload + regra débito
            const seen = new Set();

            for (const taxa of data.taxas) {

                if (taxa.tipo === TipoCartao.DEBITO &&(taxa.parcelas && taxa.parcelas > 1)) {
                    throw new BadRequestException('Débito não pode ter parcelas');
                }

                const key = `${taxa.bandeira_id}-${taxa.tipo}-${taxa.parcelas}`;

                if (seen.has(key)) {
                    throw new BadRequestException(`Duplicado no envio: bandeira ${taxa.bandeira_id}, tipo ${taxa.tipo}, parcelas ${taxa.parcelas}`);
                }

                seen.add(key);
            }

            // 4. pega taxas atuais
            const existentes = await tx.taxaCartao.findMany({where: { provedor_id: data.id }});
            const existentesIds = existentes.map(t => t.id);
            const enviadosIds = data.taxas.filter(t => t.id).map(t => t.id);

            // 5. DELETE
            const paraDeletar = existentesIds.filter(id => !enviadosIds.includes(id));

            if (paraDeletar.length > 0) {
                await tx.taxaCartao.deleteMany({where: { id: { in: paraDeletar } }});
            }

            // 6. UPDATE + CREATE
            for (const taxa of data.taxas) {

                if (taxa.id) {
                    await tx.taxaCartao.update({
                        where: { id: taxa.id },
                        data: {
                            bandeira_id: taxa.bandeira_id,
                            tipo: taxa.tipo,
                            parcelas: taxa.parcelas,
                            prazo_recebimento: taxa.prazo_recebimento,
                            taxa_percentual: taxa.taxa_percentual,
                            taxa_fixa: taxa.taxa_fixa
                        }
                    });
                } else {
                    await tx.taxaCartao.create({
                        data: {
                            ...taxa,
                            provedor_id: data.id
                        }
                    });
                }
            }

            return true;
        });
    }



    async findOne(id: number) {
        return this.prisma.tenantClient.provedorPagamento.findFirst({
            where: { id },
            include: { 
                taxas: {include: {bandeira: true}} 
            }
        });
    }

    async findAll() {
        return this.prisma.tenantClient.provedorPagamento.findMany({
            include: {
                taxas: {include: {bandeira: true}}
            }
        });
    }

    delete(id:number) {
        return this.prisma.provedorPagamento.delete({where: {id:id}});
    }
}

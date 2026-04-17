import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { PlanoEntity } from './planos.entity';
import { Repository } from 'typeorm';
import { PrismaService } from 'src/prisma/prisma.service';
import {  Terminal } from '@prisma/client';
import { SalvarTerminalDto, UpdateTerminalDto, UpdateTerminalLoginDto } from './dto';
import CustomException from 'src/exceptions/exceptions';


@Injectable()
export class TerminaisService {
    
    constructor(private prisma: PrismaService) {}

    async logar(data: UpdateTerminalLoginDto) {
        return await this.prisma.tenantClient.terminal.update({
            where: {
                id: data.terminal_id
            },
            data: {
                ultimo_login_data: new Date(),
                ultimo_login_usuario_id: data.usuario_id,
            }
        })
    }

    async salvar(data: SalvarTerminalDto) {
        try {
            const terminal = await  this.prisma.tenantClient.terminal.create({data: data});
            return terminal
        } catch (error) {
            return CustomException(error)
        }
    }

    async buscarTodos() {
        return this.prisma.tenantClient.terminal.findMany({include: { provedor_padrao: true }});
    }

    async buscarPorId(id:number) {
        return this.prisma.tenantClient.terminal.findUnique({where: { id: Number(id) },});
    }

    async update(data: UpdateTerminalDto) {
        try {
            const terminal = this.prisma.tenantClient.terminal.update({
                where: { id: Number(data.id) },
                data: data,
            });
            return terminal
        } catch (error) {
            return CustomException(error)
        }
    }

    async updateAtivo(id :number) {
        const terminal  =await this.prisma.terminal.findUnique({where: {id:id}})
        return  this.prisma.terminal.update({where:{id}, data:{ativo: !terminal?.ativo}})
    }

    async delete(id:number) {
        return this.prisma.tenantClient.terminal.delete({
            where: { id: id }
        });
    }
}

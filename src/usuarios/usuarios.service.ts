
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Empresa, PrismaClient, Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService { 
    constructor(private prisma: PrismaService) {}

    async salvar(data:Usuario) {
        const res = await this.prisma.empresa.findUnique({ where: { id: Number(data.empresa_id) }, include: {plano: true, usuarios: true} })
        if (!res) {
            throw new NotFoundException("Empresa nao encontrada");
        }
        if ( res.usuarios.length >= res.plano.qtd_licencas) {
            throw new BadRequestException("Limite de usuarios atingido");
        }
        return this.prisma.usuario.create({data:data})
    }

    async buscarTodos() {
        return this.prisma.usuario.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.usuario.findUnique({where: {id: Number(id)}})
    }

    async buscarPorEmail(username: string) {
        return this.prisma.usuario.findFirst({where: { email: username } })
    }

    async update(data:Usuario) {
        return this.prisma.usuario.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        return this.prisma.usuario.delete({where: {id: Number(id)}})
    }

}

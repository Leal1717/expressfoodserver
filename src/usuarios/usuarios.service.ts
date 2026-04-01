
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Empresa, PrismaClient, Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService { 
    constructor(private prisma: PrismaService) {}

    async salvar(data:Usuario) {
        const user = await this.prisma.tenantClient.usuario.create({data: data})
        
        const empresa_id = user.empresa_id

        const res = await this.prisma.empresa.findFirst({ where: { id: Number(empresa_id) }, include: {plano: true, usuarios: true} })
        if (!res) {
            await this.prisma.usuario.delete({where: { id: user.id }})
            throw new NotFoundException("Empresa nao encontrada");
        }
        if ( res.usuarios.length >= res.plano.qtd_licencas) {
            await this.prisma.usuario.delete({where: { id: user.id }})
            throw new BadRequestException("Limite de usuarios atingido");
        }

    }

    async buscarTodos() {
        return this.prisma.tenantClient.usuario.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.usuario.findUnique({where: {id: Number(id)}})
    }

    async buscarPorEmail(username: string) {
        return this.prisma.tenantClient.usuario.findFirst({where: { email: username } })
    }

    async update(data:Usuario) {
        return this.prisma.tenantClient.usuario.update({where: {id: Number(data.id)}, data: data})
    }

    async delete(id:number) {
        const usuarios_antes = await this.prisma.tenantClient.usuario.findFirst({where: {role: "OWNER"}})
        if (usuarios_antes && usuarios_antes.id == id) {
            throw new BadRequestException("Voce nao pode deletar o OWNER")
        }
        return this.prisma.tenantClient.usuario.delete({where: {id: Number(id)}})
    }

}

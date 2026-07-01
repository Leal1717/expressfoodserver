
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuariosService {
    constructor(private prisma: PrismaService) {}

    async salvar(data: Usuario) {
        let user: Usuario
        try {
            user = await this.prisma.tenantClient.usuario.create({ data })
        } catch (err: any) {
            if (err?.code === 'P2002') {
                throw new BadRequestException('Email já cadastrado')
            }
            throw err
        }

        const res = await this.prisma.empresa.findFirst({
            where: { id: Number(user.empresa_id) },
            include: { plano: true, usuarios: true },
        })
        if (!res) {
            await this.prisma.usuario.delete({ where: { id: user.id } })
            throw new NotFoundException('Empresa nao encontrada')
        }
        if (res.usuarios.length >= res.plano.qtd_licencas) {
            await this.prisma.usuario.delete({ where: { id: user.id } })
            throw new BadRequestException('Limite de usuarios atingido')
        }

        if (user.role === 'MOTOBOY') {
            await this.prisma.tenantClient.motoboy.create({
                data: {
                    nome: user.nome,
                    telefone: user.telefone ?? '',
                    usuario_id: user.id,
                    empresa_id: user.empresa_id,
                },
            })
        }

        return user
    }

    async buscarTodos() {
        return this.prisma.tenantClient.usuario.findMany()
    }

    async buscarPorId(id: number) {
        return this.prisma.tenantClient.usuario.findUnique({ where: { id: Number(id) } })
    }

    async buscarPorEmail(username: string) {
        return this.prisma.usuario.findFirst({ where: { email: username } })
    }

    async update(data: Usuario) {
        const updated = await this.prisma.tenantClient.usuario.update({
            where: { id: Number(data.id) },
            data,
        })

        if (updated.role === 'MOTOBOY') {
            const motoboy = await this.prisma.tenantClient.motoboy.findFirst({
                where: { usuario_id: updated.id },
            })
            if (motoboy) {
                await this.prisma.tenantClient.motoboy.update({
                    where: { id: motoboy.id },
                    data: { nome: updated.nome, telefone: updated.telefone },
                })
            } else {
                // role mudou para MOTOBOY em edição — cria o perfil
                await this.prisma.tenantClient.motoboy.create({
                    data: {
                        nome: updated.nome,
                        telefone: updated.telefone ?? '',
                        usuario_id: updated.id,
                        empresa_id: updated.empresa_id,
                    },
                })
            }
        }

        return updated
    }

    async delete(id: number) {
        const owner = await this.prisma.tenantClient.usuario.findFirst({ where: { role: 'OWNER' } })
        if (owner && owner.id == id) {
            throw new BadRequestException('Voce nao pode deletar o OWNER')
        }
        return this.prisma.tenantClient.usuario.delete({ where: { id: Number(id) } })
    }
}

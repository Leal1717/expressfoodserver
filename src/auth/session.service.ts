import { Injectable, OnModuleInit } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"

@Injectable()
export class SessionService implements OnModuleInit {
    private activeSessions = new Map<number | string, string>()

    constructor(private prisma: PrismaService) {}

    async onModuleInit() {
        const usuarios = await this.prisma.usuario.findMany({
            where: { session_id: { not: null } },
            select: { id: true, session_id: true },
        })
        for (const u of usuarios) {
            if (u.session_id) this.activeSessions.set(u.id, u.session_id)
        }
    }

    async setSession(userId: number | string, sessionId: string) {
        this.activeSessions.set(userId, sessionId)
        await this.prisma.usuario.update({
            where: { id: Number(userId) },
            data: { session_id: sessionId },
        })
    }

    getSession(userId: number | string): string | undefined {
        return this.activeSessions.get(userId)
    }

    async invalidar(userId: number | string) {
        this.activeSessions.delete(userId)
        await this.prisma.usuario.update({
            where: { id: Number(userId) },
            data: { session_id: null },
        })
    }
}

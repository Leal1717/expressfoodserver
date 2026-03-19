import { Injectable } from "@nestjs/common"

@Injectable()
export class SessionService {
    private activeSessions = new Map<number |string, string>()

    setSession(userId: number |string, sessionId: string) {
        this.activeSessions.set(userId, sessionId)
    }

    getSession(userId: number |string) : string | undefined {
        return this.activeSessions.get(userId)
    }

    invalidar(userId:number |string) {
        this.activeSessions.delete(userId)
    }
}
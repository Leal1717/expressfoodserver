import { BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

export default function CustomException(error:any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(`Valor único duplicado: ${error.meta?.target}`);
    }
    throw error;
}
import {
    Controller, Delete, Param, Post,
    UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role } from '@prisma/client';
import { Roles } from 'src/decorators/role.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { TenantService } from 'src/tenant/tenant.service';
import { OciStorageService } from './ocistorage.service';


@Roles(Role.OWNER, Role.ADMIN_GERAL)
@Controller('api/imagens')
export class ImagensController {
    constructor(
        private readonly oci: OciStorageService,
        private readonly tenant: TenantService,
        private readonly prisma: PrismaService,
    ) {}

    @Post('logo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadLogo(@UploadedFile() file: { buffer: Buffer; mimetype: string }) {
        const empresaId = Number(this.tenant.empresaId);
        const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId }, select: { cnpj: true } });
        const { url } = await this.oci.uploadLogo(empresa!.cnpj, file.buffer, file.mimetype);
        await this.prisma.empresa.update({ where: { id: empresaId }, data: { logo_url: url } });
        return { url };
    }

    @Delete('logo')
    async deleteLogo() {
        const empresaId = Number(this.tenant.empresaId);
        const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId }, select: { cnpj: true } });
        await this.oci.deleteLogo(empresa!.cnpj);
        await this.prisma.empresa.update({ where: { id: empresaId }, data: { logo_url: null } });
        return { ok: true };
    }

    @Post('itens/:itemId')
    @UseInterceptors(FileInterceptor('file'))
    async uploadItemImage(
        @Param('itemId') itemId: number,
        @UploadedFile() file: { buffer: Buffer; mimetype: string },
    ) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id: Number(this.tenant.empresaId) }, select: { cnpj: true } });
        const { url } = await this.oci.uploadItemImage(empresa!.cnpj, Number(itemId), file.buffer, file.mimetype);
        await this.prisma.tenantClient.item.update({ where: { id: Number(itemId) }, data: { imagem: url } });
        return { url };
    }

    @Delete('itens/:itemId')
    async deleteItemImage(@Param('itemId') itemId: number) {
        const empresa = await this.prisma.empresa.findUnique({ where: { id: Number(this.tenant.empresaId) }, select: { cnpj: true } });
        await this.oci.deleteItemImage(empresa!.cnpj, Number(itemId));
        await this.prisma.tenantClient.item.update({ where: { id: Number(itemId) }, data: { imagem: null } });
        return { ok: true };
    }
}

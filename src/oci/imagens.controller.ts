import {
    Controller, Delete, Param, Post,
    UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Role, TerminalTipo } from '@prisma/client';
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

    async buscarEmpresa() {
        const empresaId = Number(this.tenant.empresaId);
        const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId }, select: { cnpj: true, id: true } });
        return empresa;
    }

    //-----------------------------------------------------------------------------------------------------------------------------  LOGO

    @Post('logo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadLogo(@UploadedFile() file: { buffer: Buffer; mimetype: string }) {
        const empresa = await this.buscarEmpresa();
        const { url } = await this.oci.uploadLogo(empresa!.cnpj, file.buffer, file.mimetype);
        await this.prisma.empresa.update({ where: { id: empresa!.id! }, data: { logo_url: url } });
        return { url };
    }

    @Delete('logo')
    async deleteLogo() {
        const empresa = await this.buscarEmpresa();
        await this.oci.deleteLogo(empresa!.cnpj);
        await this.prisma.empresa.update({ where: { id: empresa!.id! }, data: { logo_url: null } });
        return { ok: true };
    }
    



    //-----------------------------------------------------------------------------------------------------------------------------  AUTOATENDIMENTO
    @Post('autoatendimento/fundo')
    @UseInterceptors(FileInterceptor('file'))
    async uploadImagemFundoAutoatendimento(@UploadedFile() file: { buffer: Buffer; mimetype: string }) {
        const empresa = await this.buscarEmpresa();
        const { url } = await this.oci.uploadImagemFundoAutoatendimento(empresa!.cnpj, file.buffer, file.mimetype);
        await this.prisma.terminal.updateMany({ where: { tipo: TerminalTipo.AUTO_TOTEM }, data: { img_fundo_url: url } });
        return { url };
    }

    @Delete('autoatendimento/fundo')
    async deleteImagemFundoAutoatendimento() {
        const empresa = await this.buscarEmpresa();
        await this.oci.deleteImagemFundoAutoatendimento(empresa!.cnpj);
        await this.prisma.terminal.updateMany({ where: { tipo: TerminalTipo.AUTO_TOTEM }, data: { img_fundo_url: null } });
        return { ok: true };
    }







    //-----------------------------------------------------------------------------------------------------------------------------  ITENS

    @Post('itens/:itemId')
    @UseInterceptors(FileInterceptor('file'))
    async uploadItemImage(
        @Param('itemId') itemId: number,
        @UploadedFile() file: { buffer: Buffer; mimetype: string },
    ) {
        const empresa = await this.buscarEmpresa();
        const { url } = await this.oci.uploadItemImage(empresa!.cnpj, Number(itemId), file.buffer, file.mimetype);
        await this.prisma.tenantClient.item.update({ where: { id: Number(itemId) }, data: { imagem: url } });
        return { url };
    }

    @Delete('itens/:itemId')
    async deleteItemImage(@Param('itemId') itemId: number) {
        const empresa = await this.buscarEmpresa();
        await this.oci.deleteItemImage(empresa!.cnpj, Number(itemId));
        await this.prisma.tenantClient.item.update({ where: { id: Number(itemId) }, data: { imagem: null } });
        return { ok: true };
    }




    //-----------------------------------------------------------------------------------------------------------------------------  EVENTOS

    @Post('eventos/:eventoId')
    @UseInterceptors(FileInterceptor('file'))
    async uploadEventoImage(
        @Param('eventoId') eventoId: number,
        @UploadedFile() file: { buffer: Buffer; mimetype: string },
    ) {
        const empresa = await this.buscarEmpresa();
        const { url } = await this.oci.uploadEventoImage(empresa!.cnpj, Number(eventoId), file.buffer, file.mimetype);
        await this.prisma.tenantClient.evento.update({ where: { id: Number(eventoId) }, data: { imagem: url } });
        return { url };
    }

    @Delete('eventos/:eventoId')
    async deleteEventoImage(@Param('eventoId') eventoId: number) {
        const empresa = await this.buscarEmpresa();
        await this.oci.deleteEventoImage(empresa!.cnpj, Number(eventoId));
        await this.prisma.tenantClient.evento.update({ where: { id: Number(eventoId) }, data: { imagem: null } });
        return { ok: true };
    }
}

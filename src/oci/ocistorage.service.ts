import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import * as oci from 'oci-sdk';

@Injectable()
export class OciStorageService implements OnModuleInit {
    private readonly logger = new Logger(OciStorageService.name);
    private client: oci.objectstorage.ObjectStorageClient;
    private namespace: string;
    private readonly bucket = process.env.OCI_BUCKET_NAME ?? 'minifood-imagens';
    private readonly region = process.env.OCI_REGION ?? 'sa-saopaulo-1';

    async onModuleInit() {
        try {
            const provider = await new oci.common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build();
            this.client = new oci.objectstorage.ObjectStorageClient({ authenticationDetailsProvider: provider });
            const response = await this.client.getNamespace({});
            this.namespace = response.value;
        } catch (e: any) {
            this.logger.warn('OCI não disponível: ' + e.message);
        }
    }

    get disponivel() { return !!this.client }

    private assertClient() {
        if (!this.client) throw new ServiceUnavailableException('OCI Storage não está configurado neste ambiente.')
    }

    private normalizeCnpj(cnpj: string) {
        return cnpj.replace(/[.\-/]/g, '');
    }

    private logoPath(cnpj: string) {
        return `${this.normalizeCnpj(cnpj)}/empresa/logo`;
    }

    private imgFundoAutoatendimentoPath(cnpj: string) {
        return `${this.normalizeCnpj(cnpj)}/empresa/autoatendimento/fundo`;
    }

    private itemPath(cnpj: string, itemId: number) {
        return `${this.normalizeCnpj(cnpj)}/itens/${itemId}`;
    }

    getUrl(objectName: string) {
        return `https://objectstorage.${this.region}.oraclecloud.com/n/${this.namespace}/b/${this.bucket}/o/${encodeURIComponent(objectName)}`;
    }

    async uploadLogo(cnpj: string, buffer: Buffer, contentType: string) {
        this.assertClient()
        const objectName = this.logoPath(cnpj);
        await this.client.putObject({
            namespaceName: this.namespace,
            bucketName: this.bucket,
            objectName,
            putObjectBody: buffer,
            contentType,
        });
        return { url: this.getUrl(objectName) };
    }

    async deleteLogo(cnpj: string) {
        this.assertClient()
        try {
            await this.client.deleteObject({
                namespaceName: this.namespace,
                bucketName: this.bucket,
                objectName: this.logoPath(cnpj),
            });
        } catch (e) {
            this.logger.warn(`deleteLogo: objeto não encontrado (${cnpj})`);
        }
    }

    async uploadImagemFundoAutoatendimento(cnpj: string, buffer: Buffer, contentType: string) {
        this.assertClient()
        const objectName = this.imgFundoAutoatendimentoPath(cnpj);
        await this.client.putObject({
            namespaceName: this.namespace,
            bucketName: this.bucket,
            objectName,
            putObjectBody: buffer,
            contentType,
        });
        return { url: this.getUrl(objectName) };
    }

    async deleteImagemFundoAutoatendimento(cnpj: string) {
        this.assertClient()
        try {
            await this.client.deleteObject({
                namespaceName: this.namespace,
                bucketName: this.bucket,
                objectName: this.imgFundoAutoatendimentoPath(cnpj),
            });
        } catch (e) {
            this.logger.warn(`deleteImagemFundoAutoatendimento: objeto não encontrado (${cnpj})`);
        }
    }

    async uploadItemImage(cnpj: string, itemId: number, buffer: Buffer, contentType: string) {
        this.assertClient()
        const objectName = this.itemPath(cnpj, itemId);
        await this.client.putObject({
            namespaceName: this.namespace,
            bucketName: this.bucket,
            objectName,
            putObjectBody: buffer,
            contentType,
        });
        return { url: this.getUrl(objectName) };
    }

    async deleteItemImage(cnpj: string, itemId: number) {
        this.assertClient()
        try {
            await this.client.deleteObject({
                namespaceName: this.namespace,
                bucketName: this.bucket,
                objectName: this.itemPath(cnpj, itemId),
            });
        } catch (e) {
            this.logger.warn(`deleteItemImage: objeto não encontrado (item ${itemId})`);
        }
    }

    // método genérico legado
    async uploadFile(bucketName: string, objectName: string, data: Buffer | string) {
        this.assertClient()
        return this.client.putObject({
            namespaceName: this.namespace,
            bucketName,
            objectName,
            putObjectBody: data,
        });
    }
}


import { Module } from '@nestjs/common';
import { ItensPdvController } from './itenspdv.controller';
import { ItensPdvService } from './itenspdv.service';

@Module({
    imports: [],
    controllers: [ItensPdvController],
    providers: [ItensPdvService],
})
export class ItensPdvModule {}

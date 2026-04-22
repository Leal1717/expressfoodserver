import { Module } from '@nestjs/common';
import { OciStorageService } from './ocistorage.service';

@Module({
    providers: [OciStorageService],
    exports: [OciStorageService],
})
export class OciModule {}

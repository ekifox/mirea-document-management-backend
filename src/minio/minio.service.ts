import { Injectable } from '@nestjs/common'
import * as Minio from 'minio'

@Injectable()
export class MinioService {
    private minioClient = new Minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: 'filestorage',
        secretKey: 'filestorage',
        region: 'default'
    })

    public async upload(documentUuid: string, buffer: Buffer) {
        return await this.minioClient.putObject('documents', documentUuid, buffer, {
            'Content-Type': 'application/pdf'
        })
    }

    public async generateTemporaryLink(documentUuid: string) {
        return await this.minioClient.presignedGetObject('documents', documentUuid, 1 * 60)
    }
}

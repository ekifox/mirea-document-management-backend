import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as Minio from 'minio'
import axios from 'axios'
import { Not } from 'typeorm'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { DocumentAuditorRepository } from '../document-auditor/auditor.repository'
import { UserEntity } from '../user/user.entity'
import { UserRepository } from '../user/user.repository'
import { DocumentRepository } from './document.repository'
import { EDocumentStatus } from './enum/status.enum'
import { IElasticSearchResponse } from './interface/elastic-search.interface'
import { DocumentSearchItemResponse } from './response/search.response'

@Injectable()
export class DocumentService {
    private s3Client = new Minio.Client({
        endPoint: 'localhost',
        port: 9000,
        useSSL: false,
        accessKey: 'filestorage',
        secretKey: 'filestorage',
        region: 'default'
    })

    @InjectRepository(DocumentRepository)
    private readonly documentRepository: DocumentRepository

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    @InjectRepository(DocumentAuditorRepository)
    private readonly documentAuditorRepository: DocumentAuditorRepository

    @Transactional()
    async create(user: UserEntity, title: string, auditorUserIds: number[]) {
        if (!user.verified) {
            throw new ForbiddenException('Not verified')
        }

        if (!user.departmentId) {
            throw new ForbiddenException('Department is not selected')
        }

        const auditors = await this.userRepository.findByIds(auditorUserIds)

        if (auditors.length !== auditorUserIds.length) {
            throw new BadRequestException('Some of provided auditors is not exist')
        }

        if (!auditors.every(x => x.verified)) {
            throw new BadRequestException('Some of provided auditors is not verified')
        }

        const document = await this.documentRepository.save({
            title,
            userId: user.id
        })

        const bulkInsertAuditors = auditors.map(auditor =>
            this.documentAuditorRepository.create({
                documentId: document.id,
                userId: auditor.id
            })
        )
        await this.documentAuditorRepository.insert(bulkInsertAuditors)

        return document
    }

    async search(text: string) {
        const {
            hits: { hits }
        } = await this.elasticSearch(text)

        const documentIds = hits.map(x => x._id)
        const documents = await this.documentRepository.findByIds(documentIds, {
            relations: ['user']
        })

        console.log(documentIds, documents)

        const response: DocumentSearchItemResponse[] = []

        for (const document of documents) {
            const elasticElement = hits.find(x => x._id === document.id)

            response.push({
                id: document.id,
                score: elasticElement._score,
                document
            })
        }

        return response
    }

    async minioUpload(user: UserEntity, documentUuid: string, buffer: Buffer) {
        await this.documentRepository.findOneOrFail({
            id: documentUuid,
            userId: user.id,
            status: Not(EDocumentStatus.PUBLISHED)
        })

        await this.s3Client.putObject('documents', documentUuid, buffer, { 'Content-Type': 'application/pdf' })
    }

    async minioTemporaryLink(documentUuid: string) {
        return await this.s3Client.presignedGetObject('documents', documentUuid, 1 * 60)
    }

    async elasticSearch(text: string) {
        const { data } = await axios.post<IElasticSearchResponse>('http://localhost:9200/documents/_search', {
            query: {
                match: {
                    'attachment.content': {
                        query: text
                    }
                }
            }
        })

        return data
    }

    async elasticUpload(documentUuid: string) {
        const link = await this.minioTemporaryLink(documentUuid)

        const { data } = await axios.get(link, { responseType: 'arraybuffer' })

        const base64 = Buffer.from(data, 'binary').toString('base64')

        await axios.put(`http://localhost:9200/documents/_doc/${documentUuid}?pipeline=attachment`, {
            filename: documentUuid + '.pdf',
            data: base64
        })
    }
}

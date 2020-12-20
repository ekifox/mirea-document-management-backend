import { BadRequestException, ForbiddenException, Inject, Injectable, NotAcceptableException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import axios from 'axios'
import { Not } from 'typeorm'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { DocumentAuditorRepository } from '../document-auditor/auditor.repository'
import { UserEntity } from '../user/user.entity'
import { UserRepository } from '../user/user.repository'
import { DocumentRepository } from './document.repository'
import { EDocumentStatus } from './enum/status.enum'
import { IElasticSearchResponse } from '../elastic/interface/elastic-search.interface'
import { DocumentSearchItemResponse } from './response/search.response'
import { MinioService } from '../minio/minio.service'
import { ElasticService } from '../elastic/elastic.service'
import { Base64String } from '../elastic/type/Base64String'
import { EDocumentAuditorStatus } from '../document-auditor/enum/status.enum'

@Injectable()
export class DocumentService {
    @InjectRepository(DocumentRepository)
    private readonly documentRepository: DocumentRepository

    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    @InjectRepository(DocumentAuditorRepository)
    private readonly documentAuditorRepository: DocumentAuditorRepository

    @Inject()
    private readonly minioService: MinioService

    @Inject()
    private readonly elasticService: ElasticService

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
        } = await this.elasticService.search(text)

        const documentIds = hits.map(x => x._id)
        const documents = await this.documentRepository.findByIds(documentIds, {
            relations: ['user']
        })

        const response: DocumentSearchItemResponse[] = []

        for (const document of documents) {
            const elasticElement = hits.find(x => x._id === document.id)
            const highlights = elasticElement.highlight['attachment.content'].map(x =>
                x.replace(/(\W\s)?(.+)(\W\s)?/iu, '$2')
            )

            response.push({
                id: document.id,
                score: elasticElement._score,
                highlight: highlights,
                document
            })
        }

        return response
    }

    public async link(user: UserEntity, documentUuid: string): Promise<string> {
        await this.documentRepository.findOneOrFail({
            id: documentUuid,
            // userId: user.id,
            status: Not(EDocumentStatus.PUBLISHED)
        })

        return await this.minioService.generateTemporaryLink(documentUuid)
    }

    public async upload(user: UserEntity, documentUuid: string, buffer: Buffer) {
        await this.documentRepository.findOneOrFail({
            id: documentUuid,
            userId: user.id,
            status: Not(EDocumentStatus.PUBLISHED)
        })

        await this.minioService.upload(documentUuid, buffer)
    }

    @Transactional()
    async publish(user: UserEntity, documentUuid: string) {
        const document = await this.documentRepository.findOneOrFail({
            id: documentUuid,
            userId: user.id,
            status: Not(EDocumentStatus.PUBLISHED)
        })

        const documentAuditors = await this.documentAuditorRepository.find({
            where: {
                document
            }
        })

        const allAccepted = documentAuditors.every(x => x.status === EDocumentAuditorStatus.ACCEPTED)

        if (!allAccepted) {
            throw new NotAcceptableException('Not all auditors accept the document')
        }

        const link = await this.minioService.generateTemporaryLink(documentUuid)
        const { data } = await axios.get(link, { responseType: 'arraybuffer' })
        const base64 = Buffer.from(data, 'binary').toString('base64') as Base64String

        await this.elasticService.upload(documentUuid, base64)

        document.status = EDocumentStatus.PUBLISHED
        await this.documentRepository.save(document)
    }
}

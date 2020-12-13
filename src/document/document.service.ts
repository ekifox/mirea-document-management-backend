import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    Injectable,
    UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as Minio from 'minio'
import { Not, Transaction } from 'typeorm'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { DocumentAuditorRepository } from '../document-auditor/auditor.repository'
import { EUserRole } from '../user/enum/role.enum'
import { UserEntity } from '../user/user.entity'
import { UserRepository } from '../user/user.repository'
import { DocumentRepository } from './document.repository'
import { EDocumentStatus } from './enum/status.enum'
import { DocumentCreateInput } from './input/create.input'

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

    async upload(user: UserEntity, documentUuid: string, buffer: Buffer) {
        await this.documentRepository.findOneOrFail({
            id: documentUuid,
            userId: user.id,
            status: Not(EDocumentStatus.PUBLISHED)
        })

        await this.s3Client.putObject('documents', documentUuid, buffer, { 'Content-Type': 'application/pdf' })
    }

    async getTemporaryLink(documentUuid: string) {
        return await this.s3Client.presignedGetObject('documents', documentUuid, 1 * 60)
    }
}

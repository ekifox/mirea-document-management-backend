import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not } from 'typeorm'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { DocumentRepository } from '../document/document.repository'
import { EDocumentStatus } from '../document/enum/status.enum'
import { UserEntity } from '../user/user.entity'
import { DocumentAuditorRepository } from './auditor.repository'
import { EDocumentAuditorStatus } from './enum/status.enum'

@Injectable()
export class DocumentAuditorService {
    @InjectRepository(DocumentRepository)
    private readonly documentRepository: DocumentRepository

    @InjectRepository(DocumentAuditorRepository)
    private readonly documentAuditorRepository: DocumentAuditorRepository

    @Transactional()
    async audit(auditorUser: UserEntity, documentId: string, isAgreed: boolean = false) {
        const document = await this.documentRepository.findOneOrFail({
            where: {
                id: documentId,
                status: Not(EDocumentStatus.PUBLISHED)
            },
            lock: {
                mode: 'pessimistic_write'
            }
        })

        const documentAuditor = await this.documentAuditorRepository.findOneOrFail({
            where: {
                document,
                user: auditorUser,
                status: EDocumentAuditorStatus.AWAITING
            },
            lock: {
                mode: 'pessimistic_write'
            }
        })

        if (!isAgreed) {
            documentAuditor.status = EDocumentAuditorStatus.REJECTED
            document.status = EDocumentStatus.AUDITOR_REJECTED
        } else {
            documentAuditor.status = EDocumentAuditorStatus.ACCEPTED
        }

        await this.documentRepository.save(document)
        await this.documentAuditorRepository.save(documentAuditor)
    }

    async list(user: UserEntity) {
        return await this.documentAuditorRepository.find({
            relations: ['document', 'document.user', 'document.user.department'],
            where: {
                user,
                status: EDocumentAuditorStatus.AWAITING
            }
        })
    }
}

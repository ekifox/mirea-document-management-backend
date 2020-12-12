import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { DocumentEntity } from '../document/document.entity'
import { DocumentRepository } from '../document/document.repository'
import { UserEntity } from '../user/user.entity'
import { DocumentAuditorRepository } from './auditor.repository'

@Injectable()
export class DocumentAuditorService {
    @InjectRepository(DocumentRepository)
    private readonly documentRepository: DocumentRepository

    @InjectRepository(DocumentAuditorRepository)
    private readonly documentAuditorRepository: DocumentAuditorRepository

    @Transactional()
    async audit(auditorUser: UserEntity, documentId: number, isAgreed: boolean = false) {
        const document = await this.documentRepository.findOneOrFail(documentId)
    }
}

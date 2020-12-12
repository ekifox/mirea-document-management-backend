import { EntityRepository } from 'typeorm'
import { BaseRepository } from 'typeorm-transactional-cls-hooked'
import { DocumentEntity } from './document.entity'

@EntityRepository(DocumentEntity)
export class DocumentRepository extends BaseRepository<DocumentEntity> {}

import { EntityRepository } from 'typeorm'
import { BaseRepository } from 'typeorm-transactional-cls-hooked'
import { DocumentAuditorEntity } from './auditor.entity'

@EntityRepository(DocumentAuditorEntity)
export class DocumentAuditorRepository extends BaseRepository<DocumentAuditorEntity> {}

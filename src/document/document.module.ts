import { Module } from '@nestjs/common'
import { DocumentService } from './document.service'
import { DocumentController } from './document.controller'
import { DocumentAuditorController } from '../document-auditor/auditor.controller'
import { DocumentAuditorService } from '../document-auditor/auditor.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentEntity } from './document.entity'
import { DocumentAuditorEntity } from '../document-auditor/auditor.entity'
import { DocumentRepository } from './document.repository'
import { DocumentAuditorRepository } from '../document-auditor/auditor.repository'
import { UserModule } from '../user/user.module'
import { ElasticModule } from '../elastic/elastic.module'
import { MinioModule } from '../minio/minio.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            DocumentEntity,
            DocumentRepository,
            DocumentAuditorEntity,
            DocumentAuditorRepository
        ]),
        UserModule,
        ElasticModule,
        MinioModule
    ],
    controllers: [DocumentController, DocumentAuditorController],
    providers: [DocumentService, DocumentAuditorService],
    exports: [TypeOrmModule]
})
export class DocumentModule {}

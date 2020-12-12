import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { DocumentAuditorEntity } from '../document-auditor/auditor.entity'
import { EDocumentStatus } from './enum/status.enum'

@Entity()
export class DocumentEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    elasticId: number

    @Column()
    name: string

    @Column()
    hash: string

    @Column('enum', {
        enum: EDocumentStatus,
        default: EDocumentStatus.CREATED
    })
    status: string

    @Column('boolean', {
        default: false,
        comment: 'Не может быть принят, пока все auditors не согласятся'
    })
    isAgreed: boolean

    @OneToMany(
        () => DocumentAuditorEntity,
        () => null
    )
    auditors: DocumentAuditorEntity[]
}

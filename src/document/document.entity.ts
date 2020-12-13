import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { DocumentAuditorEntity } from '../document-auditor/auditor.entity'
import { EDocumentStatus } from './enum/status.enum'

@Entity()
export class DocumentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('character varying')
    title: string

    @Column('integer')
    userId: number

    @Column('enum', {
        enum: EDocumentStatus,
        default: EDocumentStatus.CREATED
    })
    status: string

    @Column('boolean', {
        default: 'false',
        comment: 'Не может быть принят, пока все auditors не согласятся'
    })
    isAgreed: boolean

    @OneToMany(
        () => DocumentAuditorEntity,
        auditors => auditors.document
    )
    auditors: DocumentAuditorEntity[]
}

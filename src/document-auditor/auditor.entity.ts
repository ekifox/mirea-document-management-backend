import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { DocumentAuditorNoteEntity } from '../document-auditor-note/note.entity'
import { DocumentEntity } from '../document/document.entity'
import { UserEntity } from '../user/user.entity'
import { EDocumentAuditorStatus } from './enum/status.enum'

@Entity()
export class DocumentAuditorEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column('uuid')
    @ApiProperty()
    documentId: string

    @Column('integer')
    @ApiProperty()
    userId: number

    @Column('enum', { enum: EDocumentAuditorStatus, default: EDocumentAuditorStatus.AWAITING })
    @ApiProperty()
    status: EDocumentAuditorStatus

    @ManyToOne(
        () => UserEntity,
        () => null,
        { onDelete: 'CASCADE' }
    )
    @ApiProperty({ type: () => UserEntity })
    user: UserEntity

    @OneToMany(
        () => DocumentAuditorNoteEntity,
        notes => notes.documentAuditor,
        { onDelete: 'CASCADE' }
    )
    @ApiProperty({ type: () => [DocumentAuditorNoteEntity] })
    notes: DocumentAuditorNoteEntity[]

    @ManyToOne(
        () => DocumentEntity,
        document => document.auditors,
        { onDelete: 'CASCADE' }
    )
    document: DocumentEntity
}

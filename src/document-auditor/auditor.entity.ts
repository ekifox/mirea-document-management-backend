import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { DocumentAuditorNoteEntity } from '../document-auditor-note/note.entity'
import { DocumentEntity } from '../document/document.entity'

@Entity()
export class DocumentAuditorEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('uuid')
    documentId: string

    @Column('integer')
    userId: number

    @Column('boolean', { default: 'false' })
    isAgreed: boolean

    @ManyToOne(
        () => DocumentEntity,
        document => document.auditors
    )
    document: DocumentEntity

    @OneToMany(
        () => DocumentAuditorNoteEntity,
        notes => notes.documentAuditor
    )
    notes: DocumentAuditorNoteEntity[]
}

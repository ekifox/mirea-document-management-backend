import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { DocumentAuditorNoteEntity } from '../document-auditor-note/note.entity'

@Entity()
export class DocumentAuditorEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    documentId: number

    @Column('integer')
    userId: number

    @Column('boolean', { default: true })
    isAgreed: boolean

    @OneToMany(
        () => DocumentAuditorNoteEntity,
        () => null
    )
    notes: DocumentAuditorNoteEntity[]
}

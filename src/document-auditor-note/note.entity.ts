import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { DocumentAuditorEntity } from '../document-auditor/auditor.entity'

@Entity({
    orderBy: {
        createdAt: 'DESC'
    }
})
export class DocumentAuditorNoteEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    documentAuditorId: number

    @Column('integer')
    userId: number

    @Column('text')
    description: string

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(
        () => DocumentAuditorEntity,
        documentAuditor => documentAuditor.notes
    )
    documentAuditor: DocumentAuditorEntity
}

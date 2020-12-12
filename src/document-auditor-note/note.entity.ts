import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity({
    orderBy: {
        createdAt: 'DESC'
    }
})
export class DocumentAuditorNoteEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('integer')
    documentId: number

    @Column('integer')
    userId: number

    @Column('text')
    description: string

    @CreateDateColumn()
    createdAt: Date
}

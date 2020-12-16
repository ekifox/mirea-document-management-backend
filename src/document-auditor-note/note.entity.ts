import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm'
import { DocumentAuditorEntity } from '../document-auditor/auditor.entity'

@Entity({
    orderBy: {
        createdAt: 'DESC'
    }
})
export class DocumentAuditorNoteEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column('integer')
    @ApiProperty()
    documentAuditorId: number

    @Column('integer')
    @ApiProperty()
    userId: number

    @Column('text')
    @ApiProperty()
    description: string

    @CreateDateColumn()
    @ApiProperty()
    createdAt: Date

    @ManyToOne(
        () => DocumentAuditorEntity,
        documentAuditor => documentAuditor.notes,
        { onDelete: 'CASCADE' }
    )
    documentAuditor: DocumentAuditorEntity
}

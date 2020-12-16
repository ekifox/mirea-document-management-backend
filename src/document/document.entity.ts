import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { DocumentAuditorEntity } from '../document-auditor/auditor.entity'
import { UserEntity } from '../user/user.entity'
import { EDocumentStatus } from './enum/status.enum'

@Entity()
export class DocumentEntity {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string

    @Column('character varying')
    @ApiProperty()
    title: string

    @Column('integer')
    @ApiProperty()
    userId: number

    @Column('enum', {
        enum: EDocumentStatus,
        default: EDocumentStatus.CREATED
    })
    @ApiProperty()
    status: string

    @Column('boolean', {
        default: 'false',
        comment: 'Не может быть принят, пока все auditors не согласятся'
    })
    @ApiProperty()
    isAgreed: boolean

    @OneToMany(
        () => DocumentAuditorEntity,
        auditors => auditors.document
    )
    @ApiProperty({ type: () => [DocumentAuditorEntity] })
    auditors: DocumentAuditorEntity[]

    @ManyToOne(
        () => UserEntity,
        () => null,
        { onDelete: 'CASCADE' }
    )
    @ApiProperty({ type: () => UserEntity })
    user: UserEntity
}

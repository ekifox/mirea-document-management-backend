import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsUUID } from 'class-validator'

export class DocumentAuditorAuditInput {
    @IsUUID()
    @ApiProperty({ type: 'string', description: 'Document ID' })
    documentId: string

    @IsBoolean()
    @ApiProperty({ type: 'boolean', description: 'Согласен ли аудитор согласовать документ' })
    isAgreed: boolean
}

import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DocumentAuditorAuditInput {
    @IsUUID()
    @ApiProperty({ type: 'string', description: 'Document ID' })
    documentId: string

    @IsBoolean()
    @ApiProperty({ type: 'boolean', description: 'Согласен ли аудитор согласовать документ' })
    isAgreed: boolean
}

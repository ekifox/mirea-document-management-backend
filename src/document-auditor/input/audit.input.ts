import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DocumentAuditorAuditInput {
    @IsNumber()
    @ApiProperty({ type: 'integer', description: 'Document ID' })
    documentId: number

    @IsBoolean()
    @ApiProperty({ type: 'boolean', description: 'Согласен ли аудитор согласовать документ' })
    isAgreed: boolean
}

import { ApiProperty } from '@nestjs/swagger'

export class DocumentUploadInput {
    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    document: any[]
}

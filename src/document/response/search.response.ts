import { IsInt, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'
import { DocumentEntity } from '../document.entity'

export class DocumentSearchItemResponse {
    @ApiProperty()
    id: string

    @ApiProperty()
    score: number

    @ApiProperty({ type: () => DocumentEntity })
    document: DocumentEntity
}

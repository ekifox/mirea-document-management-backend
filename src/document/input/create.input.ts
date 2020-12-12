import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DocumentCreateInput {
    @IsString()
    @ApiProperty({ type: 'string', description: 'Название документа' })
    title: string

    @IsInt({ each: true })
    @ApiProperty({ type: ['integer'], description: 'Массив пользовательских идентификаторов аудиторов' })
    auditorUserIds: number[]
}

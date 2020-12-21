import { ArrayNotEmpty, IsInt, IsNotEmpty, IsString, Length } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class DocumentCreateInput {
    @IsNotEmpty()
    @IsString()
    @Length(6, 50)
    @ApiProperty({ type: 'string', description: 'Название документа' })
    title: string

    @IsInt({ each: true })
    @ArrayNotEmpty()
    @ApiProperty({ type: ['integer'], description: 'Массив пользовательских идентификаторов аудиторов' })
    auditorUserIds: number[]
}

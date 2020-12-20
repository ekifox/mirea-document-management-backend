import { IsInt } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AdminUserVerifyInput {
    @IsInt()
    @ApiProperty({ type: 'integer', description: 'User ID' })
    userId: number
}

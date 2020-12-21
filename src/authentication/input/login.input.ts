import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class AuthenticationLoginInput {
    @ApiProperty({
        type: String,
        description: 'Логин пользователя',
        example: 'mireauser'
    })
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    login: string

    @ApiProperty({
        type: String,
        description: 'Пароль пользователя',
        minLength: 6,
        maxLength: 20
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password: string
}

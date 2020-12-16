import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, IsString, Length } from 'class-validator'

export class AuthenticationLoginInput {
    @ApiProperty({
        type: String,
        description: 'Логин пользователя',
        example: 'mireauser'
    })
    @IsNotEmpty()
    @IsString()
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

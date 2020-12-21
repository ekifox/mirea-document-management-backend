import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'class-validator'
import { AuthenticationLoginInput } from './login.input'

export class AuthenticationRegisterInput extends AuthenticationLoginInput {
    @ApiProperty({
        type: String,
        description: 'Повторный пароль для подтверждения правильности ввода',
        minLength: 6,
        maxLength: 20
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    passwordConfirmation: string
}

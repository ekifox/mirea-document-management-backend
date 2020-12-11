import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsBoolean, IsNotEmpty, Length } from 'class-validator'
import { AuthenticationLoginInputDto } from './login.dto'

export class AuthenticationRegisterInputDto extends AuthenticationLoginInputDto {
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

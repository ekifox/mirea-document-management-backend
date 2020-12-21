import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    Inject,
    Post,
    Req,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthenticationService } from './authentication.service'
import { AuthenticationLoginInput } from './input/login.input'
import { AuthenticationRegisterInput } from './input/register.input'

@Controller('authentication')
@UsePipes(new ValidationPipe())
export class AuthenticationController {
    @Inject()
    private readonly authService: AuthenticationService

    @Post('register')
    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiBody({ type: AuthenticationRegisterInput })
    async register(@Body() registerInput: AuthenticationRegisterInput, @Req() request: Request) {
        if (request.session.userId) {
            throw new HttpException('You are already logged in', HttpStatus.CONFLICT)
        }

        const user = await this.authService.register(
            registerInput.login,
            registerInput.password,
            registerInput.passwordConfirmation
        )

        request.session.userId = user.id
        request.session.save()

        return true
    }

    @Post('login')
    @ApiOperation({ summary: 'Авторизация пользователя' })
    @ApiBody({ type: AuthenticationLoginInput })
    async login(@Body() loginInput: AuthenticationLoginInput, @Req() request: Request) {
        if (request.session.userId) {
            throw new HttpException('You are already logged in', HttpStatus.CONFLICT)
        }

        const user = await this.authService.verify(loginInput.login, loginInput.password)

        request.session.userId = user.id
        request.session.save()

        return true
    }
}

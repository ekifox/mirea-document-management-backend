import { Request } from 'express'

import { Body, Controller, HttpException, HttpStatus, Inject, Post, Req } from '@nestjs/common'
import { ApiBody, ApiOperation } from '@nestjs/swagger'

import { AuthenticationService } from './authentication.service'
import { AuthenticationLoginInputDto } from './dto/login.dto'
import { AuthenticationRegisterInputDto } from './dto/register.dto'

@Controller('authentication')
export class AuthenticationController {
    @Inject()
    private readonly authService: AuthenticationService

    @Post('register')
    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiBody({ type: AuthenticationRegisterInputDto })
    async register(@Body() registerInput: AuthenticationRegisterInputDto, @Req() request: Request) {
        if (request.session.userId) {
            throw new HttpException('AUTH.ALREADY_AUTHED', HttpStatus.CONFLICT)
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
    @ApiBody({ type: AuthenticationLoginInputDto })
    async login(@Body() loginInput: AuthenticationLoginInputDto, @Req() request: Request) {
        if (request.session.userId) {
            throw new HttpException('AUTH.ALREADY_AUTHED', HttpStatus.CONFLICT)
        }

        const user = await this.authService.verify(loginInput.login, loginInput.password)

        request.session.userId = user.id
        request.session.save()

        return true
    }
}

import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { User } from './user.decorator'
import { UserEntity } from './user.entity'
import { UserRepository } from './user.repository'

@Controller('user')
export class UserController {
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    @Get()
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiOkResponse({ type: UserEntity })
    me(@User() user: UserEntity) {
        delete user.passwordHash
        return user
    }

    @Patch()
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'Обновление собственной информации пользователем' })
    @ApiBody({ type: UserEntity })
    async update(@User() user: UserEntity, @Body() updateDto: UserEntity) {
        await this.userRepository.update(user.id, updateDto)
        return await this.userRepository.findOneOrFail(user.id)
    }

    @Get('/list')
    @ApiOperation({ summary: 'Список всех пользователей' })
    async list() {
        return await this.userRepository.find({
            relations: ['department']
        })
    }
}

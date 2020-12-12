import { Body, Controller, Get, Patch, Post } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'

import { User } from './user.decorator'
import { UserEntity } from './user.entity'
import { UserRepository } from './user.repository'

@Controller('user')
export class UserController {
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    @Get()
    @ApiOperation({ summary: 'Регистрация пользователя' })
    me(@User() user: UserEntity) {
        return user
    }

    @Patch()
    @ApiOperation({ summary: 'Обновление собственной информации пользователем' })
    async update(@User() user: UserEntity, @Body() updateDto: Partial<UserEntity>) {
        await this.userRepository.update(user, updateDto)
        return await this.userRepository.findOneOrFail(user)
    }
}

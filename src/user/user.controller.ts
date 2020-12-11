import { Controller, Get } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { User } from './user.decorator'
import { UserEntity } from './user.entity'

@Controller('user')
export class UserController {
    @Get()
    @ApiOperation({ summary: 'Регистрация пользователя' })
    async me(@User() user: UserEntity) {
        return user
    }
}

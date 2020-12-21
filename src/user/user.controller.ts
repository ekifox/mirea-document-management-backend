import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Patch,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { EUserExposeGroup } from './enum/expose.enum'
import { UserMeResponse } from './response/me.response'
import { User } from './user.decorator'
import { UserEntity } from './user.entity'
import { UserRepository } from './user.repository'

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    @Get()
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'Получить информацию о текущем пользователе' })
    @ApiOkResponse({ type: UserMeResponse })
    @SerializeOptions({ groups: [EUserExposeGroup.SELF_USER_SELECT] })
    me(@User() user: UserEntity) {
        return user
    }

    @Patch()
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'Обновление собственной информации пользователем' })
    @ApiBody({ type: UserEntity })
    @SerializeOptions({ groups: [EUserExposeGroup.SELF_USER_SELECT] })
    @UsePipes(
        new ValidationPipe({
            transform: true,
            groups: [EUserExposeGroup.SELF_USER_UPDATE],
            transformOptions: { groups: [EUserExposeGroup.SELF_USER_UPDATE] }
        })
    )
    async update(@User() user: UserEntity, @Body() updateDto: UserEntity) {
        await this.userRepository.update(user.id, updateDto)
        return await this.userRepository.findOneOrFail(user.id)
    }
}

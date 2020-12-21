import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Inject,
    Post,
    SerializeOptions,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { EUserExposeGroup } from '../user/enum/expose.enum'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'
import { AdminService } from './admin.service'
import { AdminUserVerifyInput } from './input/user-verify.input'

@Controller('admin')
@UsePipes(new ValidationPipe())
@UseGuards(AuthenticationGuard)
export class AdminController {
    @Inject()
    private readonly adminService: AdminService

    @Post('user/verify')
    @ApiOperation({ summary: 'Добавить новый документ в систему' })
    @ApiBody({ type: AdminUserVerifyInput })
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({ groups: [EUserExposeGroup.ADMIN] })
    async userVerify(@User() user: UserEntity, @Body() input: AdminUserVerifyInput) {
        await this.adminService.userVerify(user, input.userId)
        return true
    }

    @Get('user/list')
    @ApiOperation({ summary: 'Список всех пользователей' })
    @UseInterceptors(ClassSerializerInterceptor)
    @SerializeOptions({ groups: [EUserExposeGroup.ADMIN] })
    async list(@User() user: UserEntity) {
        return await this.adminService.userList(user)
    }
}

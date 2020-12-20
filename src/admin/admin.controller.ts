import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation } from '@nestjs/swagger'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'
import { AdminService } from './admin.service'
import { AdminUserVerifyInput } from './input/user-verify.input'

@Controller('admin')
export class AdminController {
    @Inject()
    private readonly adminService: AdminService

    @Post('user/verify')
    @UseGuards(AuthenticationGuard)
    @ApiOperation({ summary: 'Добавить новый документ в систему' })
    @ApiBody({ type: AdminUserVerifyInput })
    async userVerify(@User() user: UserEntity, @Body() input: AdminUserVerifyInput) {
        await this.adminService.userVerify(user, input.userId)
        return true
    }
}

import { Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { EUserRole } from '../user/enum/role.enum'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'

@Controller('admin')
export class AdminController {
    @Post('confirmUser')
    @UseGuards(AuthenticationGuard)
    async confirmUser(@User() user: UserEntity) {
        if (user.role !== EUserRole.ADMIN) {
            throw new UnauthorizedException()
        }

        return true
    }
}

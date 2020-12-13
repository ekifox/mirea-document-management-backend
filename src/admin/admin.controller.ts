import { Controller, Post, UnauthorizedException, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { AuthenticationGuard } from '../authentication/authentication.guard'
import { EUserRole } from '../user/enum/role.enum'
import { User } from '../user/user.decorator'
import { UserEntity } from '../user/user.entity'
import { UserRepository } from '../user/user.repository'

@Controller('admin')
export class AdminController {
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    @Post('confirmUser')
    @UseGuards(AuthenticationGuard)
    async confirmUser(@User() user: UserEntity) {
        await this.userRepository.update(user, { verified: true })

        return true
    }
}

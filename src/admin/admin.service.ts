import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EUserRole } from '../user/enum/role.enum'
import { UserEntity } from '../user/user.entity'
import { UserRepository } from '../user/user.repository'

@Injectable()
export class AdminService {
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository

    public async userVerify(adminUser: UserEntity, verifyUserId: number) {
        if (adminUser.role !== EUserRole.ADMIN) {
            throw new UnauthorizedException()
        }

        await this.userRepository.update({ id: verifyUserId }, { verified: true })
    }

    public async userList(adminUser: UserEntity) {
        if (adminUser.role !== EUserRole.ADMIN) {
            throw new UnauthorizedException()
        }

        return await this.userRepository.find({
            relations: ['department']
        })
    }
}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DepartmentModule } from '../department/department.module'
import { UserController } from './user.controller'
import { UserEntity } from './user.entity'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserRepository]), DepartmentModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [TypeOrmModule, UserService]
})
export class UserModule {}

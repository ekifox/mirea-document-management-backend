import { Repository } from 'typeorm'

import { Controller, Get } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DepartmentEntity } from './department.entity'
import { UserEntity } from '../user/user.entity'
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('department')
@Controller('department')
export class DepartmentController {
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>

    @Get()
    @ApiOperation({ summary: 'Получить список всех департаментов и их пользователей' })
    @ApiOkResponse({
        type: [DepartmentEntity]
    })
    async list(): Promise<DepartmentEntity[]> {
        return await this.departmentRepository
            .createQueryBuilder('department')
            .innerJoinAndSelect('department.users', 'user')
            .where('user.verified = TRUE')
            .getMany()
    }
}

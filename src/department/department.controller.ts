import { ClassSerializerInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DepartmentEntity } from './department.entity'

@ApiTags('department')
@Controller('department')
export class DepartmentController {
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>

    @Get()
    @ApiOperation({ summary: 'Получить список всех департаментов и их пользователей' })
    @ApiOkResponse({ type: [DepartmentEntity] })
    @UseInterceptors(ClassSerializerInterceptor)
    async list(): Promise<DepartmentEntity[]> {
        return await this.departmentRepository
            .createQueryBuilder('department')
            .leftJoinAndSelect('department.users', 'user', 'user.verified = TRUE')
            .getMany()
    }
}

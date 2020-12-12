import { Repository } from 'typeorm'

import { Controller, Get } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { DepartmentEntity } from './department.entity'

@Controller('department')
export class DepartmentController {
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>

    @Get()
    async list() {
        return await this.departmentRepository.find()
    }
}

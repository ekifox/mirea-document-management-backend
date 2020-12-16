import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DepartmentController } from './department.controller'
import { DepartmentEntity } from './department.entity'

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEntity])],
    controllers: [DepartmentController],
    exports: [TypeOrmModule]
})
export class DepartmentModule {}

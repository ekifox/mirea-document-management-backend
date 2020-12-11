import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DepartmentEntity } from './department.entity'

@Module({
    imports: [TypeOrmModule.forFeature([DepartmentEntity])],
    exports: [TypeOrmModule]
})
export class DepartmentModule {}

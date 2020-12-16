import { ApiProperty } from '@nestjs/swagger'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { DepartmentEntity } from '../department/department.entity'
import { EUserRole } from './enum/role.enum'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column('character varying')
    @ApiProperty()
    login: string

    @Column('character varying')
    @ApiProperty()
    passwordHash: string

    @Column('character varying', { nullable: true })
    @ApiProperty()
    firstName: string

    @Column('character varying', { nullable: true })
    @ApiProperty()
    middleName: string

    @Column('character varying', { nullable: true })
    @ApiProperty()
    lastName: string

    @Column('character varying', { nullable: true })
    @ApiProperty()
    phone: string

    @Column('character varying', { nullable: true })
    @ApiProperty()
    email: string

    @Column('integer', { nullable: true })
    @ApiProperty()
    departmentId: number

    @Column('date', { nullable: true })
    @ApiProperty()
    dateOfBirth: Date

    @Column('enum', { enum: EUserRole, default: EUserRole.USER })
    @ApiProperty()
    role: EUserRole

    @Column('boolean', { default: false })
    @ApiProperty()
    verified: Boolean

    @CreateDateColumn()
    @ApiProperty()
    createdAt: Date

    @UpdateDateColumn()
    @ApiProperty()
    updatedAt: Date

    @ManyToOne(
        () => DepartmentEntity,
        () => null
    )
    department: DepartmentEntity
}

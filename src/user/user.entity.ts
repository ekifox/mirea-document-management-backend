import { ApiProperty } from '@nestjs/swagger'
import { IsAlpha, IsBoolean, IsDateString, IsEmail, IsEnum, IsInt, IsPhoneNumber, IsString } from 'class-validator'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { DepartmentEntity } from '../department/department.entity'
import { EUserRole } from './enum/role.enum'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column('character varying')
    @IsString()
    @ApiProperty()
    login: string

    @Column('character varying')
    @IsString()
    @ApiProperty()
    passwordHash: string

    @Column('character varying', { nullable: true })
    @IsAlpha('ru-RU')
    @ApiProperty()
    firstName: string

    @Column('character varying', { nullable: true })
    @IsAlpha('ru-RU')
    @ApiProperty()
    middleName: string

    @Column('character varying', { nullable: true })
    @IsAlpha('ru-RU')
    @ApiProperty()
    lastName: string

    @Column('character varying', { nullable: true })
    @IsPhoneNumber('RU')
    @ApiProperty()
    phone: string

    @Column('character varying', { nullable: true })
    @IsEmail()
    @ApiProperty()
    email: string

    @Column('integer', { nullable: true })
    @IsInt()
    @ApiProperty({ nullable: true })
    departmentId: number | null

    @Column('date', { nullable: true })
    @ApiProperty()
    dateOfBirth: Date

    @Column('enum', { enum: EUserRole, default: EUserRole.USER })
    @IsEnum(EUserRole)
    @ApiProperty()
    role: EUserRole

    @Column('boolean', { default: false })
    @IsBoolean()
    @ApiProperty()
    verified: Boolean

    @CreateDateColumn()
    @IsDateString()
    @ApiProperty()
    createdAt: Date

    @UpdateDateColumn()
    @IsDateString()
    @ApiProperty()
    updatedAt: Date

    @ManyToOne(
        () => DepartmentEntity,
        () => null
    )
    department: DepartmentEntity
}

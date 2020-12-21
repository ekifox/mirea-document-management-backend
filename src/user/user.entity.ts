import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose } from 'class-transformer'
import {
    IsAlpha,
    IsBoolean,
    IsDateString,
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsPhoneNumber,
    IsString
} from 'class-validator'
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { DepartmentEntity } from '../department/department.entity'
import { EUserExposeGroup } from './enum/expose.enum'
import { EUserRole } from './enum/role.enum'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column('character varying')
    @IsString()
    @ApiProperty()
    @Expose({ groups: [EUserExposeGroup.SELF_USER_SELECT, EUserExposeGroup.SELF_USER_UPDATE, EUserExposeGroup.ADMIN] })
    login: string

    @Column('character varying')
    @IsString()
    @IsOptional()
    @ApiProperty()
    @Exclude()
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
    @Expose({ groups: [EUserExposeGroup.SELF_USER_SELECT, EUserExposeGroup.SELF_USER_UPDATE, EUserExposeGroup.ADMIN] })
    phone: string

    @Column('character varying', { nullable: true })
    @IsEmail()
    @ApiProperty()
    @Expose({ groups: [EUserExposeGroup.SELF_USER_SELECT, EUserExposeGroup.SELF_USER_UPDATE, EUserExposeGroup.ADMIN] })
    email: string

    @Column('integer', { nullable: true })
    @IsInt()
    @ApiProperty({ nullable: true })
    departmentId: number | null

    @Column('date', { nullable: true })
    @ApiProperty()
    @Expose({ groups: [EUserExposeGroup.SELF_USER_SELECT, EUserExposeGroup.SELF_USER_UPDATE, EUserExposeGroup.ADMIN] })
    dateOfBirth: Date

    @Column('enum', { enum: EUserRole, default: EUserRole.USER })
    @IsEnum(EUserRole)
    @ApiProperty()
    @Expose({ groups: [EUserExposeGroup.SELF_USER_SELECT, EUserExposeGroup.ADMIN] })
    role: EUserRole

    @Column('boolean', { default: false })
    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    @Expose({ groups: [EUserExposeGroup.SELF_USER_SELECT, EUserExposeGroup.ADMIN] })
    verified: Boolean

    @CreateDateColumn()
    @IsDateString()
    @ApiProperty()
    @Expose({ groups: [EUserExposeGroup.SELF_USER_SELECT, EUserExposeGroup.ADMIN] })
    createdAt: Date

    @UpdateDateColumn()
    @IsDateString()
    @ApiProperty()
    @Expose({ groups: [EUserExposeGroup.ADMIN] })
    updatedAt: Date

    @ManyToOne(
        () => DepartmentEntity,
        () => null
    )
    department: DepartmentEntity
}

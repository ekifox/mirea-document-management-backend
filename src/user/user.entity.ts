import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm'
import { DepartmentEntity } from '../department/department.entity'
import { EUserRole } from './enum/role.enum'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('character varying')
    login: string

    @Column('character varying')
    passwordHash: string

    @Column('character varying', { nullable: true })
    firstName: string

    @Column('character varying', { nullable: true })
    middleName: string

    @Column('character varying', { nullable: true })
    lastName: string

    @Column('character varying', { nullable: true })
    phone: string

    @Column('character varying', { nullable: true })
    email: string

    @Column('integer', { nullable: true })
    departmentId: number

    @Column('date', { nullable: true })
    dateOfBirth: Date

    @Column('enum', { enum: EUserRole, default: EUserRole.USER })
    role: EUserRole

    @Column('boolean', { default: false })
    verified: Boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @ManyToOne(
        () => DepartmentEntity,
        () => null
    )
    department: DepartmentEntity
}

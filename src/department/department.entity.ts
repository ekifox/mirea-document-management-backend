import { ApiProperty } from '@nestjs/swagger'
import { userInfo } from 'os'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { UserEntity } from '../user/user.entity'

@Entity()
export class DepartmentEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number

    @Column('character varying')
    @ApiProperty()
    name: string

    @OneToMany(
        () => UserEntity,
        user => user.department
    )
    @JoinColumn()
    @ApiProperty({ type: [UserEntity] })
    users: UserEntity[]
}

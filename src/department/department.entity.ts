import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
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

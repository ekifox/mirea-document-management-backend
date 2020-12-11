import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

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

    @Column('date', { nullable: true })
    dateOfBirth: Date

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}

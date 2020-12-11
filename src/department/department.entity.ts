import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class DepartmentEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column('character varying')
    name: string
}

import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  email: string

  @Column({ name: 'created_at', select: false, update: false })
  createdAt: Date

  @Column({ name: 'updated_at', select: false })
  updatedAt: Date
}

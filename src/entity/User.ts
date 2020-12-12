import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'

@Entity({ name: 'users' })
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column({ nullable: true })
  thumbnail: string

  @Column()
  timezone: string

  @Column({ name: 'created_at', type: 'timestamptz', select: false, update: false })
  @CreateDateColumn()
  createdAt: Date

  @Column({ name: 'updated_at', type: 'timestamptz', select: false })
  @UpdateDateColumn()
  updatedAt: Date
}

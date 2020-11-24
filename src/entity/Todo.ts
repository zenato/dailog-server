import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import User from './User'

@Entity({ name: 'todos' })
export default class Todo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'timestamptz', update: false })
  date: Date

  @Column()
  title: string

  @Column({ name: 'is_done' })
  isDone: boolean

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'created_at', type: 'timestamptz', select: false, update: false })
  @CreateDateColumn()
  createdAt!: Date

  @Column({ name: 'updated_at', type: 'timestamptz', select: false })
  @UpdateDateColumn()
  updatedAt!: Date
}

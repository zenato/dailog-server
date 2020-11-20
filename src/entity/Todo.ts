import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm'
import User from './User'

@Entity({ name: 'todos' })
export default class Todo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ update: false })
  date: Date

  @Column()
  title: string

  @Column({ name: 'is_done' })
  isDone: boolean

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User
}
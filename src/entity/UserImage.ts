import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import User from './User'

@Entity({ name: 'user_images' })
export default class UserImage extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: true })
  path: string

  @Column({ nullable: true })
  filesize: number

  @Column()
  type!: string

  @Column({ name: 'created_at', select: false, update: false })
  @CreateDateColumn()
  createdAt!: Date

  @Column({ name: 'updated_at', select: false })
  @UpdateDateColumn()
  updatedAt!: Date

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User
}

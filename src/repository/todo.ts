import { EntityRepository, Repository } from 'typeorm'
import { User, Todo } from '../entity'

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  public async findByDuration(user: User, start: Date, end: Date) {
    return this.createQueryBuilder('t')
      .where('t.user.id = :userId')
      .andWhere('t.date >= :start')
      .andWhere('t.date <= :end')
      .setParameters({ userId: user.id, start, end })
      .getMany()
  }
}

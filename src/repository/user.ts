import { EntityRepository, Repository } from 'typeorm'
import { User } from '../entity'
import { decodeToken } from '../lib/crypto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async findByToken(token?: string) {
    if (token) {
      const decoded: { userId: number } = await decodeToken(token)
      const user = await this.findOne(decoded.userId)
      if (user) {
        return user
      }
    }
    return null
  }
}

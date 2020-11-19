import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { Request } from 'express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repository'
import { User } from '../entity'

export interface ApolloContext {
  user?: User
}

const context = async ({ req }: ExpressContext): Promise<ApolloContext> => {
  try {
    const token = (req as Request).headers.authorization || (req as Request).cookies.authorization
    const repo = getCustomRepository(UserRepository)
    const user = await repo.findByToken(token)
    if (user) {
      return { user }
    }
    return {}
  } catch (e) {
    return {}
  }
}

export default context

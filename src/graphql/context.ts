import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { getRepository } from 'typeorm'
import { User } from '../entity'
import { decodeToken } from '../lib/crypto'

export interface ApolloContext {
  user?: User
}

const context = async ({ req }: ExpressContext): Promise<ApolloContext> => {
  try {
    const token = req.headers.authorization || req.cookies.authorization
    if (token) {
      const decoded: { userId: number } = await decodeToken(token)
      const user = await getRepository(User).findOne(decoded.userId)
      return { user }
    }
    return {}
  } catch (e) {
    return {}
  }
}

export default context

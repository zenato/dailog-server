import { AuthenticationError } from 'apollo-server-express'
import { ApolloContext } from './context'

const authenticated = (fn: (parent: any, args: any, context: ApolloContext) => any) => async (
  parent: any,
  args: any,
  context: ApolloContext
) => {
  if (!context.user) {
    throw new AuthenticationError('Required Authenticated')
  }
  return await fn(parent, args, context)
}

export default authenticated

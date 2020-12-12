import { gql, IResolvers, ApolloError } from 'apollo-server-express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../../repository'
import authenticated from '../authenticated'

export const typeDef = gql`
  type User {
    id: ID!
    email: String
    name: String
    timezone: String
    thumbnail: String
    createdAt: Date
    updatedAt: Date
  }
  extend type Query {
    #user(id: ID): User
    me: User
  }
  extend type Mutation {
    updateProfileName(name: String!): User
    updateThumbnail(url: String): User
    updateTimezone(tz: String!): User
  }
`

export const resolvers: IResolvers = {
  Query: {
    me: authenticated((parent, args, context) => context.user),
  },
  Mutation: {
    updateProfileName: authenticated(async (parent: any, args: { name: string }, context) => {
      if (!args.name) {
        throw new ApolloError('Name should not be empty', 'BAD_REQUEST')
      }
      const repo = getCustomRepository(UserRepository)
      return await repo.save(repo.merge(context.user, { name: args.name }))
    }),
    updateThumbnail: authenticated(async (parent: any, args: { url: string }, context) => {
      const repo = getCustomRepository(UserRepository)
      return await repo.save(repo.merge(context.user, { thumbnail: args.url }))
    }),
    updateTimezone: authenticated(async (parent: any, args: { timezone: string }, context) => {
      if (!args.timezone) {
        throw new ApolloError('Timezone should not be empty', 'BAD_REQUEST')
      }
      const repo = getCustomRepository(UserRepository)
      return await repo.save(repo.merge(context.user, { name: args.timezone }))
    }),
  },
}

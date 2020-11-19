import { gql, IResolvers, ApolloError } from 'apollo-server-express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../../repository'
import authenticated from '../authenticated'

export const typeDef = gql`
  type User {
    id: ID!
    email: String
    name: String
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
      const userRepository = getCustomRepository(UserRepository)
      return await userRepository.save(userRepository.merge(context.user, { name: args.name }))
    }),
    updateThumbnail: authenticated(async (parent: any, args: { url: string }, context) => {
      const userRepository = getCustomRepository(UserRepository)
      return await userRepository.save(userRepository.merge(context.user, { thumbnail: args.url }))
    }),
  },
}

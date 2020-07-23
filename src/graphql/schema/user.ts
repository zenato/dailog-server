import { gql, IResolvers, ApolloError } from 'apollo-server-express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../../repository'
import authenticated from '../authenticated'

export const typeDef = gql`
  type User {
    id: ID!
    email: String
    name: String
    createdAt: Date
    updatedAt: Date
  }
  extend type Query {
    #user(id: ID): User
    me: User
  }
  extend type Mutation {
    updateProfile(name: String!): User
  }
`

export const resolvers: IResolvers = {
  Query: {
    me: authenticated((parent, args, context) => context.user),
  },
  Mutation: {
    updateProfile: authenticated(async (parent: any, args: { name: string }, context) => {
      if (!args.name) {
        throw new ApolloError('Name should not be empty', 'BAD_REQUEST')
      }
      const userRepository = getCustomRepository(UserRepository)
      return await userRepository.save(userRepository.merge(context.user, { name }))
    }),
  },
}

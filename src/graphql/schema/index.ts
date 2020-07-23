import merge from 'lodash/merge'
import { gql, makeExecutableSchema, IResolvers } from 'apollo-server-express'
import * as user from './user'
import * as todo from './todo'

const typeDef = gql`
  scalar Date
  type Query {
    _version: String
  }
  type Mutation {
    _empty: String
  }
`

const resolvers: IResolvers = {
  Query: {
    _version: () => '1.0',
  },
  Mutation: {},
}

const schema = makeExecutableSchema({
  typeDefs: [typeDef, user.typeDef, todo.typeDef],
  resolvers: merge(resolvers, user.resolvers, todo.resolvers),
})

export default schema

import { gql, IResolvers } from 'apollo-server-express'
import { getCustomRepository } from 'typeorm'
import { TodoRepository } from '~/repository'
import dayjs from '~/lib/dayjs'
import authenticated from '../authenticated'

interface TodoInput {
  year: string
  month: string
  date: string
  title: string
}

export const typeDef = gql`
  type Todo {
    id: ID!
    date: Date
    title: String
    isDone: Boolean
  }

  input TodoInput {
    year: String!
    month: String!
    date: String!
    title: String
  }

  extend type Query {
    todos(year: String!, month: String!, date: String): [Todo]
  }

  extend type Mutation {
    addTodo(input: TodoInput!): Todo
    updateTodo(id: ID!, isDone: Boolean!): Todo
    deleteTodo(id: ID!): Boolean
  }
`

const parseDate = (timezone: string, year: string, month: string, date?: string) =>
  dayjs.tz(`${year}-${month}-${date || '01'} 00:00:00.000`, timezone)

export const resolvers: IResolvers = {
  Query: {
    todos: authenticated(async (parent, { year, month, date }, { user }) => {
      const start = parseDate(user.timezone, year, month, date)
      const end = start.add(1, date ? 'day' : 'month').add(-1, 'millisecond')

      const repo = getCustomRepository(TodoRepository)
      const todos = await repo.findByDuration(user, start.toDate(), end.toDate())
      return todos
    }),
  },
  Mutation: {
    addTodo: authenticated(async (parent: any, args: { input: TodoInput }, { user }) => {
      const { year, month, date, ...otherInput } = args.input

      const repo = getCustomRepository(TodoRepository)
      return await repo.save({
        ...otherInput,
        date: parseDate(user.timezone, year, month, date).toDate(),
        user,
        isDone: false,
      })
    }),
    updateTodo: authenticated(
      async (parent: any, args: { id: string; isDone: boolean }, { user }) => {
        const repo = getCustomRepository(TodoRepository)
        const todo = await repo.findOneOrFail({ user, id: args.id })
        repo.merge(todo, { isDone: args.isDone })
        return await repo.save(todo)
      }
    ),
    deleteTodo: authenticated(async (parent: any, args: { id: string }, { user }) => {
      const repo = getCustomRepository(TodoRepository)
      await repo.delete({ user, id: args.id })
      return true
    }),
  },
}

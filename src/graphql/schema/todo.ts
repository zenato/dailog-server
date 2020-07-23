import { gql, IResolvers } from 'apollo-server-express'
import { getCustomRepository } from 'typeorm'
import dayjs from 'dayjs'
import { TodoRepository } from '../../repository'
import authenticated from '../authenticated'
import { Todo } from '../../entity'

export const typeDef = gql`
  type Todo {
    id: ID!
    date: Date
    title: String
    isDone: Boolean
  }
  extend type Query {
    todosByMonthly(year: Int!, month: Int!): [Todo]
  }
  extend type Mutation {
    addTodo(year: Int!, month: Int!, date: Int!, title: String): Todo
  }
`

export const resolvers: IResolvers = {
  Query: {
    todosByMonthly: authenticated(async (parent, args, context) => {
      const startDate = dayjs()
        .set('year', args.year)
        .set('month', args.month - 1)
        .startOf('month')
      const endDate = startDate.endOf('month')
      const todoRepository = getCustomRepository(TodoRepository)
      const todos = await todoRepository.findByDuration(
        context.user,
        startDate.toDate(),
        endDate.toDate()
      )
      return todos
    }),
  },
  Mutation: {
    addTodo: authenticated(
      async (
        parent: any,
        args: { year: number; month: number; date: number; title: string },
        context
      ) => {
        const todoRepository = getCustomRepository(TodoRepository)
        const date = dayjs()
          .set('year', args.year)
          .set('month', args.month - 1)
          .set('date', args.date)
          .toDate()

        const todo = new Todo()
        todo.user = context.user
        todo.title = args.title
        todo.date = date
        todo.isDone = false

        return await todoRepository.save(todo)
      }
    ),
  },
}

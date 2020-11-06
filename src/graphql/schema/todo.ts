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

  input TodoInput {
    date: Date!
    title: String
  }

  extend type Query {
    todosByMonthly(date: Date!): [Todo]
    todosByDate(date: Date!): [Todo]
  }

  extend type Mutation {
    addTodo(input: TodoInput!): Todo
    updateTodo(id: ID!, isDone: Boolean!): Todo
    deleteTodo(id: ID!): Boolean
  }
`

export const resolvers: IResolvers = {
  Query: {
    todosByMonthly: authenticated(async (parent, args, context) => {
      const startDate = dayjs(args.date)
      const endDate = startDate.add(1, 'month').add(1, 'millisecond')
      const todoRepository = getCustomRepository(TodoRepository)
      const todos = await todoRepository.findByDuration(
        context.user,
        startDate.toDate(),
        endDate.toDate()
      )
      return todos
    }),
    todosByDate: authenticated(async (parent, args, context) => {
      const todoRepository = getCustomRepository(TodoRepository)
      const todos = await todoRepository.find({
        where: { user: context.user, date: new Date(args.date) },
        order: { id: 'ASC' },
      })
      return todos
    }),
  },
  Mutation: {
    addTodo: authenticated(async (parent: any, args: { input: Todo }, context) => {
      const todoRepository = getCustomRepository(TodoRepository)

      const todo = new Todo()
      todoRepository.merge(todo, args.input, {
        user: context.user,
        isDone: false,
      })
      return await todoRepository.save(todo)
    }),
    updateTodo: authenticated(
      async (parent: any, args: { id: number; isDone: boolean }, context) => {
        const todoRepository = getCustomRepository(TodoRepository)
        const todo = await todoRepository.findOneOrFail({ user: context.user, id: args.id })
        todoRepository.merge(todo, { isDone: args.isDone })
        return await todoRepository.save(todo)
      }
    ),
    deleteTodo: authenticated(async (parent: any, args: { id: number }, context) => {
      const todoRepository = getCustomRepository(TodoRepository)
      await todoRepository.delete({ user: context.user, id: args.id })
      return true
    }),
  },
}

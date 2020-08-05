import express, { Request, Response, NextFunction } from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import routes from './routes'
import schema from './graphql/schema'
import context from './graphql/context'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())
app.use(routes)

const server = new ApolloServer({
  schema,
  context,
  tracing: process.env.NODE_ENV === 'development',
})
server.applyMiddleware({ app })

console.log(`graph path : ${server.graphqlPath}`)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ errors: (err as any).errors || [] })
  }
  res.sendStatus(500)
})

export default app

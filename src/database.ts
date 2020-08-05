import pg from 'pg'
import { ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { User, Todo } from './entity'

// Parse integer field
pg.defaults.parseInt8 = true

const DEFAULT_DB_NAME = 'default'

const defaultConfig: ConnectionOptions = {
  name: DEFAULT_DB_NAME,
  type: 'postgres',
  ssl: false,
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [User, Todo],
}

const connectionManager = getConnectionManager()

export default async () => {
  if (!connectionManager.has(DEFAULT_DB_NAME)) {
    await createConnection(defaultConfig)
  }
}

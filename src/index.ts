import './env'
import app from './app'
import { initialize } from './database'

const port: number = Number(process.env.PORT) || 3000

app.listen(port, async () => {
  console.info(`> Listening on ${port}`)
  console.info(`> Running mode is ${process.env.NODE_ENV || 'dev'}`)

  await initialize()
  console.info(`> Initialized database connection`)
})

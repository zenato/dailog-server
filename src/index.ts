import './env'
import app from './app'
import createDatabase from './database'

const port: number = Number(process.env.PORT) || 3000

app.listen(port, async () => {
  console.log(`> Listening on ${port}`)
  console.log(`> Running mode is ${process.env.NODE_ENV || 'dev'}`)

  await createDatabase()
  console.log('> Created database connection')
})

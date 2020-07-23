import './env'
import app from './app'

const port: number = Number(process.env.PORT) || 3000

app.listen(port, () => {
  console.log(`* Listening on ${port}.`)
  console.log(`* Running mode is ${process.env.NODE_ENV || 'dev'}.`)
})

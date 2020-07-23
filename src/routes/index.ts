import { Router, Response } from 'express'
import authRouter from './auth'

const router = Router()

router.get('/', (_, res: Response) => {
  res.json({ message: 'hello' })
})

router.use('/auth', authRouter)

export default router

import { Router, Response, RequestHandler } from 'express'
import { getCustomRepository } from 'typeorm'
import { UserRepository } from '../repository'
import authRouter from './auth'
import filesRouter from './files'

const authMiddleware: RequestHandler = async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.authorization
    const repo = getCustomRepository(UserRepository)
    const user = await repo.findByToken(token)
    if (user) {
      req.user = user
      return next()
    }
    res.sendStatus(403)
  } catch (e) {
    next(e)
  }
}

const router = Router()

router.get('/', (_, res: Response) => {
  res.json({ message: 'hello' })
})

router.use('/auth', authRouter)
router.use('/files', authMiddleware, filesRouter)

export default router

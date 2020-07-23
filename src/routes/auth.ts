import { Router, Request, Response, NextFunction } from 'express'
import { getCustomRepository } from 'typeorm'
import * as yup from 'yup'
import { UserRepository } from '../repository'
import * as crypto from '../lib/crypto'

const router = Router()

type Login = {
  email: string
  password: string
}

const loginSchema = yup.object<Login>({
  email: yup
    .string()
    .required('Email is required')
    .email('Not valid email'),
  password: yup.string().required('Password is required'),
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = await loginSchema.validate(req.body, { stripUnknown: true })

    const userRepository = getCustomRepository(UserRepository)
    const user = await userRepository.findOne({
      where: { email: params.email },
      select: ['id', 'password'],
    })

    if (!user) {
      res.sendStatus(401)
      return
    }

    const authenticated = await crypto.verify(params.password, user.password)
    if (!authenticated) {
      res.sendStatus(401)
      return
    }

    const accessToken = await crypto.generateToken({ userId: user.id })
    res.json({ accessToken })
  } catch (e) {
    next(e)
  }
})

router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization || req.cookies.authorization
    if (token) {
      const decoded: { userId: number } = await crypto.decodeToken(token)
      const user = await getCustomRepository(UserRepository).findOne(decoded.userId)
      return res.json({ user })
    }
    res.json({ user: null })
  } catch (e) {
    next(e)
  }
})

export default router

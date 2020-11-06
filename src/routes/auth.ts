import { Router } from 'express'
import { getCustomRepository } from 'typeorm'
import passport from 'passport'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import { UserRepository } from '../repository'
import * as crypto from '../lib/crypto'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0]?.value ?? ''
        if (!email) {
          throw Error('E-Mail not found')
        }

        const userRepository = getCustomRepository(UserRepository)
        let user = await userRepository.findOne({
          where: { email },
          select: ['id'],
        })

        if (!user) {
          const now = new Date()
          user = await userRepository.save({
            email,
            name: profile.displayName,
            createdAt: now,
            updatedAt: now,
          })
        }

        done(null, user)
      } catch (e) {
        done(e)
      }
    }
  )
)

const router = Router()

router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/google/connect', (req, res, next) =>
  passport.authenticate('google', async (err, user) => {
    if (err) {
      next(err)
      return
    }

    const accessToken = await crypto.generateToken({ userId: user.id })
    res.cookie('authorization', accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: '/',
      secure: false,
    })
    res.redirect('/')
  })(req, res, next)
)

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

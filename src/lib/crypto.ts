import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const SECRET_KEY: string = process.env.SECRET_KEY
const TOKEN_ISSUER: string = process.env.TOKEN_ISSUER

export async function hash(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function verify(password: string, hashed: string) {
  return await bcrypt.compare(password, hashed)
}

export function generateToken(payload: any): Promise<string> {
  const options = {
    issuer: TOKEN_ISSUER,
  }
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, options, (err: any, token: string) => {
      if (err) {
        reject(err)
      }
      resolve(token)
    })
  })
}

export function decodeToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded)
    })
  })
}

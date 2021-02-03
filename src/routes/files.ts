import { Router } from 'express'
import { getRepository } from 'typeorm'
import mime from 'mime-types'
import AWS from 'aws-sdk'
import { User, UserImage } from '../entity'

const BUCKET_NAME = 'dailog-data'

const s3 = new AWS.S3({
  region: 'ap-northeast-2',
  signatureVersion: 'v4',
})

const generateSignedUrl = (path: string, filename: string) => {
  const contentType = mime.lookup(filename)
  if (!contentType) {
    const error = new Error('Failed to parse Content-Type from filename')
    error.name = 'ContentTypeError'
    throw error
  }
  if (!contentType.includes('image')) {
    const error = new Error('Given file is not a image')
    error.name = 'ContentTypeError'
    throw error
  }
  const uploadPath = `${path}/${filename}`
  return s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: uploadPath,
    ContentType: contentType,
  })
}

export const generateUploadPath = ({
  id,
  type,
  username,
}: {
  username: string
  id: string
  type: string
}) => `images/${username}/${type}/${id}`

const router = Router()

router.post('/create-url/:type(profile)', async (req, res, next) => {
  const { filename } = req.body

  if (!filename) {
    return res.sendStatus(400)
  }

  try {
    const userImageRepo = getRepository(UserImage)

    const user = req.user as User
    const userImage = new UserImage()
    userImage.user = req.user as User
    userImage.type = req.params.type
    await userImageRepo.save(userImage)

    const path = generateUploadPath({
      type: userImage.type,
      id: userImage.id,
      username: user.id.toString(),
    })
    const signedUrl = generateSignedUrl(path, filename)
    userImage.path = `${path}/${filename}`
    await userImageRepo.save(userImage)

    res.json({
      path: `https://d1blhsk92nb13a.cloudfront.net/${userImage.path}`,
      signedUrl: signedUrl,
    })
  } catch (e) {
    next(e)
  }
})

export default router

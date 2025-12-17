import './instrument'

import * as Sentry from '@sentry/node'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'

import { PORT } from './env'

import { errorHandler } from './middleware/errors'

import authRoutes from './modules/auth'

dotenv.config()

export function main() {
  const app = express()
  app.use(
    cors({
      origin: ['http://localhost:5173'],
      credentials: true
    })
  )
  app.use(express.json())
  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use('/auth', authRoutes)

  app.get('/', (_: Request, res: Response) => {
    res.status(200).json({
      status: 'OK'
    })
  })

  app.get('/sentry-debug', () => {
    throw new Error('Test sentry error!')
  })

  Sentry.setupExpressErrorHandler(app)
  app.use(errorHandler)

  const port = PORT

  app.listen(port, () => {
    console.info(`Server is running on port ${port}`)
  })
}

main()

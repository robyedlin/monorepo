import { Request, Response } from 'express'

export const errorHandler = (error: Error, _req: Request, res: Response) => {
  console.info(error)
  res.status(500).json({ error: 'Something went wrong' })
}

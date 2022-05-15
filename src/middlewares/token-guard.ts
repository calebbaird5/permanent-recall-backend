import * as jwt from 'jsonwebtoken'
import { IncomingHttpHeaders } from 'http';
import { RequestHandler } from 'express'
import { UserService } from '../services/user.service'

const userService = new UserService()

function getTokenFromHeaders(headers: IncomingHttpHeaders) {
  const header = headers.authorization as string

  if (!header) return header

  return header.split(' ')[1]
}

export const tokenGuard: (() => RequestHandler) =  (() => async (req, res, next) => {
  const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || ''
  let hasAccess = await userService.verifyToken(token)
  if (!hasAccess) return res.status(403).send({ message: 'No access' })
  next()
})

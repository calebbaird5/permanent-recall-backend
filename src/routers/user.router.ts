import { Router } from 'express'
import { matchedData, validationResult } from 'express-validator'
import { userRules } from '../rules/user.rules'
import { UserService } from '../services/user.service'
import { User } from '../models/user'

export const userRouter = Router()
const userService = new UserService()

userRouter.post('/register', userRules['forRegister'], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).json(errors.array());

  const payload = matchedData(req) as User;
  const user = await userService.register(payload);

  return res.json(user);
})

userRouter.post('/login', userRules['forLogin'], async (req, res) => {
  console.log('in login')
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return res.status(422).json(errors.array());

  const payload = matchedData(req) as User;
  const token = await userService.login(payload);

  return res.json(token);
})

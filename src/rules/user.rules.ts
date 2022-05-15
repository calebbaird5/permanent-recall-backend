import * as bcrypt from 'bcrypt'
import { check } from 'express-validator'
import { User } from '../models/user'

export const userRules = {
  forRegister: [
    check('email')
      .isEmail().withMessage('Invalid email format')
      .custom(async email => {
        let user = await User.findOne({ where: { email } });
        return !!!user;
      }).withMessage('Email exists'),
    check('password')
      .isLength({ min: 8 }).withMessage('Invalid password'),
    check('confirmPassword')
      .custom((confirmPassword, { req }) => req.body.password === confirmPassword).withMessage('Passwords are different')
  ],
  forLogin: [
    check('email')
      .isEmail().withMessage('Invalid email format')
      .custom(async email => {
        let user = await User.findOne({ where: { email } });
        return !!user;
      }).withMessage('Invalid email or password'),
    check('password')
      .custom(async (password, { req }) => {
        let user = await User.findOne({ where: { email: req.body.email } });
        return bcrypt.compare(password, user!.passwordHash);
      }).withMessage('Invalid email or password')
  ]
}

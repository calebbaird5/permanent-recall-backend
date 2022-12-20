
import { NextFunction, Request, Response } from 'express';
import { User, UserDocument } from '../models/user.model';
import { badRequest, validateParams, accessDenied } from '../lib/router-handler'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { SignedToken } from '../models/auth.model';
const jwtSecret = process.env['JWT_SECRET'];

export function signToken({id, email}, res): SignedToken {
  const maxAge = 3 * 60 * 60 * 1000; // 3hrs in ms
  const token = jwt.sign(
    { id, email },
    jwtSecret,
    { expiresIn: maxAge }
  );
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: maxAge,
  });
  return { token, expiresIn: maxAge };
}

export async function login(req: Request, res: Response)
: Promise<SignedToken> {
  validateParams(req, {
    requiredBodyParams: {fields: ['email', 'password']}});

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password').exec()
    if (!user) throw accessDenied();
    let result = await bcrypt.compare(password, user.password);
    if (!result) throw accessDenied();
    return {
      ...signToken({id: user.id, email}, res),
      user: await User.findOne({ email }),
    }
  } catch (error) {
    console.error(error);
    throw badRequest('Login Failed')
  }

};

export async function updateRole(req: Request) {
  validateParams(req, {
    requiredBodyParams: {fields: ['role']},
    requiredUrlParams: {fields: ['userId']},
  });

  const { role } = req.body;
  const user = await User.findOne({ id: req.params.userId })
  if (!user) {
    return null
  }
  // TODO:: update the role
};

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Not authorized' })
      } else {

        const user = await User.findOne({ _id: decodedToken.id })
        req.user = user;
        next()
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}

import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { User } from '../models/user'

export class UserService {
  private readonly _saltRounds = 12;
  private readonly _jwtSecret = '0.rfyj3n9nzh';

  static get userAttributes() {
    return ['id', 'email', 'firstName', 'lastName'];
  }
  private static _user;
  static get user() {
    return UserService._user
  }

  async register({ email, password }: User) {
    let hash = await bcrypt.hash(password, this._saltRounds);
    let user = await User.create({email, passwordHash: hash});
    return this.getUserById(user.id);
  }

  async login({ email }: User) {
    let user = await User.findOne({ where: { email }});
    return {
      token: jwt.sign(
        { id: user.id, email: user.email }, this._jwtSecret)};
  }

  verifyToken(token: string) {
    return new Promise((resolve) => {
      jwt.verify(token, this._jwtSecret, (err, decoded) => {
        if (err) {
          resolve(false)
          return
        }

        UserService._user = User.findByPk(decoded['id'])
        resolve(true)
        return
      })
    }) as Promise<boolean>
  }

  getUserById(id: string) {
    return User.findByPk(id, {
      attributes: UserService.userAttributes
    });
  }
}

import { UserDocument } from './user.model';

export interface SignedToken {
  token: string,
  expiresIn: number,
  user?: UserDocument,
};

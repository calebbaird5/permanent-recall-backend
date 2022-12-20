import { UserDocument } from '../../src/models/user.model';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument;
  }
}

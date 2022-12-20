import { Router, Request, Response, NextFunction } from 'express';
import { createUser } from '../controllers/user.controller';
import { login } from '../controllers/auth.controller';
import { handleError, handleResult, RouterError } from '../lib/router-handler';
import { updateRole } from '../controllers/role.controller';

export function authRouter() {
  const router = Router();

  router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    return createUser(req, res).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    return login(req, res).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.put('/users/:userId/updateRole', (req: Request, res: Response, next: NextFunction) => {
    return updateRole(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  return router;
};

import { Router, Request, Response, NextFunction } from 'express';
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from '../controllers/user.controller';
import { handleError, handleResult, RouterError } from '../lib/router-handler';

export function userRouter() {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    return createUser(req, res).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return getAllUsers().then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    return getUser(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    return updateUser(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    return deleteUser(req).then(
      () => res.status(201).json({data: {}, message: 'Successfully deleted' }) ,
      (err: RouterError) => handleError(err, next, res),
    );
  });

  return router;
};

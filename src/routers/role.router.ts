import { Router, Request, Response, NextFunction } from 'express';
import { createRole, deleteRole, getAllRoles, getRole, updateRole } from '../controllers/role.controller';
import { handleError, handleResult, RouterError } from '../lib/router-handler';

export function roleRouter() {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    return createRole(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return getAllRoles(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    return getRole(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    return updateRole(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    return deleteRole(req).then(
      () => res.status(201).json({data: {}, message: 'Successfully deleted' }) ,
      (err: RouterError) => handleError(err, next, res),
    );
  });

  return router;
};

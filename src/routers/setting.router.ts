import { Router, Request, Response, NextFunction } from 'express';
import { createSetting, deleteSetting, getAllSettings, getSetting, updateSetting } from '../controllers/setting.controller';
import { handleError, handleResult, RouterError } from '../lib/router-handler';

export function settingRouter() {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    return createSetting(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return getAllSettings(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    return getSetting(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    return updateSetting(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    return deleteSetting(req).then(
      () => res.status(201).json({data: {}, message: 'Successfully deleted' }) ,
      (err: RouterError) => handleError(err, next, res),
    );
  });

  return router;
};

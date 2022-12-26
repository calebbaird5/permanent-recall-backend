import { Router, Request, Response, NextFunction } from 'express';
import { createPassage, deletePassage, getAllPassages, getPassage, getPassageReviewList, getPassageUploadFormat, reviewPassage, updatePassage, uploadPassages } from '../controllers/passage.controller';
import { handleError, handleResult, RouterError } from '../lib/router-handler';

export function passageRouter() {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    return createPassage(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return getAllPassages(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/reviewList', (req: Request, res: Response, next: NextFunction) => {
    return getPassageReviewList(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/uploadFormat', (req: Request, res: Response, next: NextFunction) => {
    return getPassageUploadFormat(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.post('/upload', (req: Request, res: Response, next: NextFunction) => {
    return uploadPassages(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    return getPassage(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
    return updatePassage(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.put('/:id/review', (req: Request, res: Response, next: NextFunction) => {
    return reviewPassage(req).then(
      result => handleResult(result, res),
      (err: RouterError) => handleError(err, next, res),
    );
  });

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    return deletePassage(req).then(
      () => res.status(201).json({data: {}, message: 'Successfully deleted' }) ,
      (err: RouterError) => handleError(err, next, res),
    );
  });

  return router;
};

import { Request, Response, NextFunction } from 'express';

export class RouterError extends Error {
  code: string;

  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RouterError.prototype);
  }
}

export function badRequest(message = 'Bad Request', type = '') {
  let err = new RouterError(message);
  err.code = 'BAD REQUEST';
  switch (type) {
    case 'missing_param':
      err.code = err.code + '-MISSING PARAM';
      break;
  }
  return err;
}

interface Param {
  name: string,
  fields: string[],
  onlyOneRequired?: boolean,
}

interface RequiredParams {
  fields: (string | Param)[],
  onlyOneRequired?: boolean,
}

interface RequiredParamsObj {
  requiredUrlParams?: RequiredParams,
  requiredQueryParams?: RequiredParams,
  requiredBodyParams?: RequiredParams,
}

function handleParam(
  param: string | Param,
  parent: any,
  onlyOneRequired = false
): void {
  let paramName = typeof param === 'string' ? param : param.name;
  if (!paramName) return;
  if (!parent[paramName])
    throw 'Missing required param ' + paramName;
  else if (typeof param === 'object' && Array.isArray(param.fields)) {
    if (param.onlyOneRequired) onlyOneRequired = true;
    let errorMessage = '';
    let foundOneOfTheFields = false;
    for (let field of param.fields) {
      try {
        handleParam(field, param);
        foundOneOfTheFields = true;
      } catch (message) {
        errorMessage = paramName + '. ' + message;
        if (!onlyOneRequired) throw errorMessage;
      }
      if (onlyOneRequired && !foundOneOfTheFields)
        throw errorMessage;
    }
  }
};


/**
 * Validate Params ::  Used to check for required paramiters in the url, body, or query.
 *    requiredUrlParams, requiredBodyParams, and requiredQueryParams are all formatted
 *    the same. There values should be an array where each element is formatted in one
 *    of two ways:
 *      - A string with value indicating the name of the required parameter.
 *      - An object of type {name: String, fields: Array}
 *         * `name` which is a string whose value indicates the name of the required
 *            parameter.
 *         * 'fields' which is an array of strings or objects of type
 *            {name: String, fields: Array}. This allows you to specify nested required
 *            parameters.
 * @param {Express Http Request} req
 * @param {requiredUrlParams, requiredQueryParams, requiredBodyParams}
 * @throws badRequest error specified which parameters are malformed or missing.
 */
export function validateParams(
  req: Request, {
    requiredUrlParams,
    requiredQueryParams,
    requiredBodyParams
  }: RequiredParamsObj
): void {

  if (requiredUrlParams) {
    for (let param of requiredUrlParams.fields) {
      try {
        handleParam(param, req.params);
      } catch (message) {
        throw badRequest('Malformed url.' + message);
      }
    }
  }

  if (requiredQueryParams) {
    for (let param of requiredQueryParams.fields) {
      try {
        handleParam(param, req.query);
      } catch (message) {
        throw badRequest('Malformed query.' + message);
      }
    }
  }

  if (requiredBodyParams) {
    for (let param of requiredBodyParams.fields) {
      try {
        handleParam(param, req.body);
      } catch (message) {
        throw badRequest('Malformed body. ' + message);
      }
    }
  }
}


export function handleError(
  err: RouterError,
  next: NextFunction,
  res: Response,
  scope = ''
) {
  if (err.code) {
    if (err.code == 'NOT_AUHTORIZED')
      return res.status(401).json(
        { errorMessage: 'You are not authorized to view this content'});

    if (err.code == 'FORBIDDEN')
      return res.status(403).json({ errorMessage: 'You are not allowed to ' + scope });

    if (err.code.slice(0,11) === 'BAD REQUEST')
      switch (err.code.slice(12)) {
        case 'MISSING PARAM':
          return res.status(422)
              .json({ errorMessage: err.message || 'Your request was missing a required param' });
        default:
          return res.status(400)
              .json({ errorMessage: err.message || 'Your request was not formatted correctly' });
      }

    if (err.code == 'DUPLICATION')
      return res.status(424).json({ errorMessage: err.message });

    if (err.code === 'EMAIL_TAKEN')
      return res.status(423).json({ errorMessage: err.message });

  }
  return next(err);
}

export function handleResult(result: any, res: Response) {
  if (!result)
    return res.status(404).json({ errorMessage: 'Record not found' });
  return res.status(201).json({data: result});
};

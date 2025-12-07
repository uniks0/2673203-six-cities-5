import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
// import { ANONYMOUS_USER_ID } from '../../../../rest/index.js';

export class AuthMiddleware implements Middleware {
  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'AuthMiddleware');
    }

    // req.user = { id: ANONYMOUS_USER_ID };
    next();
  }
}

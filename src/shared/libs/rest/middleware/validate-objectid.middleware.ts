import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import { HttpError } from '../errors/index.js';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}

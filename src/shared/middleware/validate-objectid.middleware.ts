import { injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { Middleware } from './middleware.interface';

@injectable()
export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private readonly paramName: string) {}

  public execute(req: Request, res: Response, next: NextFunction): void {
    const value = req.params[this.paramName];
    console.log('ValidateObjectIdMiddleware', value);

    if (!isValidObjectId(value)) {
      res.status(400).json({ message: `Invalid ${this.paramName}: ${value}` });
      return;
    }

    next();
  }
}

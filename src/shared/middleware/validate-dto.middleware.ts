import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface';

export class ValidateDtoMiddleware<T extends object> implements Middleware {
  constructor(private readonly dtoClass: new () => T) {}

  public async execute(req: Request, res: Response, next: NextFunction) {
    const dtoObject = new this.dtoClass();

    Object.assign(dtoObject, req.body);

    (dtoObject as any).offerId = req.params.offerId;
    (dtoObject as any).userId = req.user?.id ?? 'anonymous';

    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      res.status(400).json({ message: 'Validation failed', errors });
      return;
    }

    req.body = dtoObject;
    next();
  }
}

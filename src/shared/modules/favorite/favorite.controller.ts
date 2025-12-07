import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../../types/index.js';
import { FavoriteService } from './favorite.service.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class FavoriteController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService
  ) {
    super(logger);

    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Post, handler: this.add });
    this.addRoute({ path: '/:offerId/favorite', method: HttpMethod.Delete, handler: this.remove });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
  }

  public async add(req: Request, res: Response): Promise<void> {
    const userId = req.tokenPayload?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'FavoriteController');
    }

    await this.favoriteService.addToFavorites(userId, req.params.offerId);
    this.noContent(res);
  }

  public async remove(req: Request, res: Response): Promise<void> {
    const userId = req.tokenPayload?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'FavoriteController');
    }

    await this.favoriteService.removeFromFavorites(userId, req.params.offerId);
    this.noContent(res);
  }

  public async index(req: Request, res: Response): Promise<void> {
    const userId = req.tokenPayload?.id;
    if (!userId) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'FavoriteController');
    }

    const favorites = await this.favoriteService.findFavoritesByUser(userId);
    this.ok(res, favorites);
  }
}

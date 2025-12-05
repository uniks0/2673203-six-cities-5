import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../../types/index.js';
import { FavoriteService } from './favorite.service.interface.js';

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

  public async add({ params, user }: Request, res: Response): Promise<void> {
    await this.favoriteService.addToFavorites(user.id, params.offerId);
    this.noContent(res);
  }

  public async remove({ params, user }: Request, res: Response): Promise<void> {
    await this.favoriteService.removeFromFavorites(user.id, params.offerId);
    this.noContent(res);
  }

  public async index({ user }: Request, res: Response): Promise<void> {
    const favorites = await this.favoriteService.findFavoritesByUser(user.id);
    this.ok(res, favorites);
  }
}

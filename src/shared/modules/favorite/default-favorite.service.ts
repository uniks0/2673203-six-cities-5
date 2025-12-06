import { DocumentType, types } from '@typegoose/typegoose';
import { injectable, inject } from 'inversify';
import { Logger } from 'pino';
import { OfferEntity } from '../offer';
import { FavoriteEntity } from './favorite.entity.js';
import { FavoriteService } from './favorite.service.interface.js';
import { Component } from '../../../types/component.enum.js';

@injectable()
export class DefaultFavoriteService implements FavoriteService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.FavoriteModel) private readonly favoriteModel: types.ModelType<FavoriteEntity>,
  ) {}

  public async addToFavorites(userId: string, offerId: string): Promise<void> {
    await this.favoriteModel.updateOne(
      { userId, offerId },
      { userId, offerId },
      { upsert: true }
    ).exec();

    this.logger.info(`Offer ${offerId} added to user ${userId} favorites`);
  }

  public async removeFromFavorites(userId: string, offerId: string): Promise<void> {
    await this.favoriteModel.deleteOne({ userId, offerId }).exec();
    this.logger.info(`Offer ${offerId} removed from user ${userId} favorites`);
  }

  public async isFavorite(userId: string, offerId: string): Promise<boolean> {
    return (await this.favoriteModel.exists({ userId, offerId })) !== null;
  }

  public async findFavoritesByUser(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const favorites = await this.favoriteModel.find({ userId }).populate('offerId').exec();
    return favorites.map((item) => item.offerId as DocumentType<OfferEntity>);
  }
}

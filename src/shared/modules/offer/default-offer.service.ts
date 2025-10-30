import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferService } from './offer.service.interface.js';
import { City, Component } from '../../../types/index.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  private offerModel: any;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) offerModel: types.ModelType<OfferEntity>
  ) {
    this.offerModel = offerModel;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async find(limit = 60): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find().limit(limit).populate('author').exec();
  }

  public async updateById(offerId: string, dto: Partial<CreateOfferDto>): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('author').exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ city, isPremium: true }).populate('author').exec();
  }

  public async findFavorites(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ isFavorite: true }).populate('author').exec();
  }

  public async updateFavoriteStatus(offerId: string, isFavorite: boolean): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { isFavorite }, { new: true }).populate('author').exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    const offer = await this.offerModel.exists({ _id: offerId });
    return offer !== null;
  }

  public async incrementCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, { $inc: { commentsCount: 1 } }, { new: true }).exec();
  }
}

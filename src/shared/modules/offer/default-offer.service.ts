import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferService } from './offer.service.interface.js';
import { City, Component } from '../../../types/index.js';
import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/index.js';
import { CommentEntity } from '../comment/index.js';

@injectable()
export class DefaultOfferService implements OfferService {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
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
    return this.offerModel.find().sort({ publicationDate: -1 }).limit(limit).populate('author').exec();
  }

  public async updateById(offerId: string, dto: Partial<CreateOfferDto>): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(offerId, dto, { new: true }).populate('author').exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId).exec();
  }

  public async findPremiumByCity(city: City): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ city, isPremium: true }).limit(3).sort({ publicationDate: -1 }).populate('author').exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    const offer = await this.offerModel.exists({ _id: offerId });
    return offer !== null;
  }

  public async incrementCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndUpdate(
      offerId,
      { $inc: { commentsCount: 1 } },
      { new: true }
    ).exec();
  }

  public async updateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const comments = await this.commentModel.find({ offerId });
    const averageRating = comments.length > 0
      ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
      : 0;

    return this.offerModel.findByIdAndUpdate(
      offerId,
      { rating: parseFloat(averageRating.toFixed(1)) },
      { new: true }
    ).exec();
  }
}

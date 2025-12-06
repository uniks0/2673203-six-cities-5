import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { Logger } from 'pino';
import { OfferService } from '../offer/offer.service.interface.js';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment.service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ) {}

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    this.logger.info(`New comment created for offer ${dto.offerId}`);

    await this.offerService.incrementCommentCount(dto.offerId);
    await this.offerService.updateRating(dto.offerId);

    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ publicationDate: -1 })
      .limit(50)
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }

  public async exists(commentId: string): Promise<boolean> {
    const comment = await this.commentModel.exists({ _id: commentId });
    return comment !== null;
  }
}

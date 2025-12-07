import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { City, Component } from '../../../types/index.js';
import { OfferService } from './offer.service.interface.js';
import { OfferRdo } from './index.js';
import { fillDTO } from '../../helpers/index.js';
import { ValidateObjectIdMiddleware } from '../../libs/rest/middleware/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../libs/rest/middleware/document-exist.middleware.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { FavoriteService } from '../favorite/favorite.service.interface.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.FavoriteService) private readonly favoriteService: FavoriteService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/', method: HttpMethod.Post, handler: this.create });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();

    let favoriteIds: string[] = [];
    if (req.tokenPayload?.id) {
      const favoriteOffers = await this.favoriteService.findFavoritesByUser(req.tokenPayload.id);
      favoriteIds = favoriteOffers.map((offer) => offer.id);
    }

    const offersWithFavorite = offers.map((offer) => {
      const dto = fillDTO(OfferRdo, offer);
      dto.favorite = favoriteIds.includes(offer.id);
      return dto;
    });

    this.ok(res, offersWithFavorite);
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    if (!tokenPayload?.id) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'OfferController');
    }

    const offerData = {
      ...body,
      author: tokenPayload.id
    };

    const result = await this.offerService.create(offerData);
    const offer = await this.offerService.findById(result.id);

    this.created(res, fillDTO(OfferRdo, offer));
  }


  public async show({ params }: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(params.offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update({ params, body }: Request, res: Response): Promise<void> {
    const updated = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferRdo, updated));
  }

  public async delete(_req: Request, res: Response): Promise<void> {
    this.noContent(res);
  }

  public async getPremium({ params }: Request, res: Response): Promise<void> {
    const city = params.city as City;
    const offers = await this.offerService.findPremiumByCity(city);
    this.ok(res, fillDTO(OfferRdo, offers));
  }
}

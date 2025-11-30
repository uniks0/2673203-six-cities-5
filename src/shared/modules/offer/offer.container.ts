import { Container } from 'inversify';
import { DefaultOfferService } from './default-offer.service.js';
import { OfferService } from './offer.service.interface.js';
import { Component } from '../../../types/index.js';
import { OfferController, OfferEntity, OfferModel } from './index.js';
import { types } from '@typegoose/typegoose';
import { Controller } from '../../libs/rest/index.js';

export function createOfferContainer() {
  const offerContainer = new Container();
  offerContainer.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}

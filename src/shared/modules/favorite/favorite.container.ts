import { Container } from 'inversify';
import { Component } from '../../../types';
import { DefaultFavoriteService } from './default-favorite.service.js';
import { FavoriteEntity, FavoriteModel } from './favorite.entity.js';
import { FavoriteService } from './favorite.service.interface.js';
import { types } from '@typegoose/typegoose';

export function createFavoriteContainer() {
  const favoriteContainer = new Container();

  favoriteContainer.bind<FavoriteService>(Component.FavoriteService)
    .to(DefaultFavoriteService)
    .inSingletonScope();

  favoriteContainer.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel)
    .toConstantValue(FavoriteModel);

  return favoriteContainer;
}

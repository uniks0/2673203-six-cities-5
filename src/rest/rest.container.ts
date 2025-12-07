import { Container } from 'inversify';
import { Logger, PinoLogger } from '../shared/libs/logger/index.js';
import { Config, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import { Application } from './index.js';
import { AppExceptionFilter, Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { DefaultOfferService } from '../shared/modules/offer/default-offer.service.js';
import { OfferController } from '../shared/modules/offer/offer.controller.js';
import { OfferEntity, OfferModel } from '../shared/modules/offer/offer.entity.js';
import { OfferService } from '../shared/modules/offer/offer.service.interface.js';
import { types } from '@typegoose/typegoose';
import { CommentController } from '../shared/modules/comment/comment.controller.js';
import { CommentEntity, CommentModel } from '../shared/modules/comment/comment.entity.js';
import { CommentService } from '../shared/modules/comment/comment.service.interface.js';
import { DefaultCommentService } from '../shared/modules/comment/default-comment.service.js';
import { DefaultFavoriteService } from '../shared/modules/favorite/default-favorite.service.js';
import { FavoriteController } from '../shared/modules/favorite/favorite.controller.js';
import { FavoriteEntity, FavoriteModel } from '../shared/modules/favorite/favorite.entity.js';
import { FavoriteService } from '../shared/modules/favorite/favorite.service.interface.js';
import { DefaultUserService } from '../shared/modules/user/default-user.service.js';
import { UserController } from '../shared/modules/user/user.controller.js';
import { UserEntity, UserModel } from '../shared/modules/user/user.entity.js';
import { UserService } from '../shared/modules/user/user.service.interface.js';
import { createAuthContainer } from '../shared/modules/auth/index.js';

export function createApplicationContainer() {
  const container = new Container();

  container.bind<Application>(Component.Application).to(Application).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<ExceptionFilter>(Component.ExceptionFilter).to(AppExceptionFilter).inSingletonScope();

  container.bind<OfferService>(Component.OfferService).to(DefaultOfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  container.bind<Controller>(Component.OfferController).to(OfferController).inSingletonScope();

  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  container.bind<CommentService>(Component.CommentService).to(DefaultCommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();

  container.bind<FavoriteService>(Component.FavoriteService).to(DefaultFavoriteService).inSingletonScope();
  container.bind<types.ModelType<FavoriteEntity>>(Component.FavoriteModel).toConstantValue(FavoriteModel);
  container.bind<Controller>(Component.FavoriteController).to(FavoriteController).inSingletonScope();

  container.load(createAuthContainer());

  return container;
}

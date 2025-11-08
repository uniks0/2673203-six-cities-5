
import { Component } from './types/index.js';
import { Application } from './rest/index.js';
import 'reflect-metadata';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer, DefaultUserService } from './shared/modules/user/index.js';
import { createOfferContainer, DefaultOfferService } from './shared/modules/offer/index.js';
import { createCommentContainer, DefaultCommentService } from './shared/modules/comment/index.js';
import { createUserAuthContainer } from './shared/modules/user/user-auth.container.js';
import { DefaultUserAuthService } from './shared/modules/user/user-auth.service.js';

async function bootstrap() {
  const restContainer = createRestApplicationContainer();
  const userContainer = createUserContainer();
  const offerContainer = createOfferContainer();
  const commentContainer = createCommentContainer();
  const authContainer = createUserAuthContainer();
  restContainer.bind(Component.Application).to(Application);
  userContainer.bind(Component.UserService).to(DefaultUserService);
  offerContainer.bind(Component.OfferService).to(DefaultOfferService);
  commentContainer.bind(Component.CommentService).to(DefaultCommentService);
  authContainer.bind(Component.UserAuthService).to(DefaultUserAuthService);

  const application = restContainer.get<Application>(Component.Application);
  await application.init();
}

bootstrap();

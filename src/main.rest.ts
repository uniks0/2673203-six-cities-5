
import { Component } from './types/index.js';
import { Application } from './rest/index.js';
import 'reflect-metadata';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer, DefaultUserService } from './shared/modules/user/index.js';

async function bootstrap() {
  const restContainer = createRestApplicationContainer();
  const userContainer = createUserContainer();
  restContainer.bind(Component.Application).to(Application);
  userContainer.bind(Component.UserService).to(DefaultUserService);

  const application = restContainer.get<Application>(Component.Application);
  await application.init();
}

bootstrap();

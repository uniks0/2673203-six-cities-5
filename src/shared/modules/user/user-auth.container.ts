import { Container } from 'inversify';
import { UserAuthService, DefaultUserAuthService } from './user-auth.service.js';
import { Component } from '../../../types/component.enum.js';

export function createUserAuthContainer() {
  const authContainer = new Container();

  authContainer.bind<UserAuthService>(Component.UserAuthService)
    .to(DefaultUserAuthService)
    .inSingletonScope();

  return authContainer;
}

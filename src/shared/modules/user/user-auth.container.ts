import { Container } from 'inversify';
import { Component } from '../../../types';
import { UserAuthService, DefaultUserAuthService } from './user-auth.service';

export function createUserAuthContainer() {
  const authContainer = new Container();

  authContainer.bind<UserAuthService>(Component.UserAuthService)
    .to(DefaultUserAuthService)
    .inSingletonScope();

  return authContainer;
}

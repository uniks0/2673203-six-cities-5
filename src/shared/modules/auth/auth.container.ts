import { ContainerModule } from 'inversify';
import { AuthService } from './auth-service.interface.js';
import { DefaultAuthService } from './default-auth.service.js';
import { ExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';
import { Component } from '../../../types/index.js';

export function createAuthContainer() {
  return new ContainerModule(({ bind }) => {
    bind<AuthService>(Component.AuthService)
      .to(DefaultAuthService)
      .inSingletonScope();

    bind<ExceptionFilter>(Component.AuthExceptionFilter)
      .to(AuthExceptionFilter)
      .inSingletonScope();
  });
}

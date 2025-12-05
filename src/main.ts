
import { Component } from './types/index.js';
import { Application } from './rest/index.js';
import 'reflect-metadata';
import { createApplicationContainer } from './rest/rest.container.js';

async function bootstrap() {
  const container = createApplicationContainer();
  const application = container.get<Application>(Component.Application);
  await application.init();
}

bootstrap();

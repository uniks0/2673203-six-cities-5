import { DocumentType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserService } from './user.service.interface.js';
import { Component } from '../../../types/component.enum.js';
import { UserEntity } from './user.entity.js';

export interface UserAuthService {
    login(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null>;
    logout(userId: string): Promise<void>;
    checkStatus(userId: string): Promise<boolean>;
  }

  @injectable()
export class DefaultUserAuthService implements UserAuthService {
  constructor(
      @inject(Component.UserService) private readonly userService: UserService,
      @inject(Component.Logger) private readonly logger: Logger
  ) {}

  public async login(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.info(`Login failed for ${dto.email}: user not found`);
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      this.logger.info(`User ${dto.email} logged in`);
      return user;
    }

    this.logger.info(`Login failed for ${dto.email}: incorrect password`);
    return null;
  }

  public async logout(userId: string): Promise<void> {
    this.logger.info(`User ${userId} logged out`);
  }

  public async checkStatus(userId: string): Promise<boolean> {
    const user = await this.userService.findByEmail(userId);
    return !!user;
  }
}

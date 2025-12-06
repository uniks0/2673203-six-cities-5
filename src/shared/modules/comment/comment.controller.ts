import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../../types/index.js';
import { CommentService } from './comment.service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

declare module 'express-serve-static-core' {
  interface Request {
    user: { id: string };
  }
}

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Get, handler: this.index });
    this.addRoute({ path: '/:offerId/comments', method: HttpMethod.Post, handler: this.create });
  }

  public async index({ params }: Request, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, comments);
  }

  public async create({ params, body, user }: Request, res: Response): Promise<void> {
    const dto: CreateCommentDto = {
      ...body,
      offerId: params.offerId,
      userId: user.id,
    };

    const result = await this.commentService.create(dto);
    this.created(res, result);
  }
}

import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto.js';
import { RequestBody, RequestParams } from '../../libs/rest/index.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;

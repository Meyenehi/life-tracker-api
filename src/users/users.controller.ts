import {
  Controller,
  Get,
  Post,
  Req,
  Param,
  Body,
  Request,
  UsePipes,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { User, UserSanitized } from './interfaces/users.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/users.dto';
import { createUserValidator } from './dtos/users.validation';
import { JoiValidationPipe } from '../shared/joi.pipe';
import { UserByIdPipe } from './users.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(new JoiValidationPipe(createUserValidator))
    createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<UserSanitized[]> {
    const users = await this.usersService.findAll();
    return users.map(user => user.sanitize());
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user.sanitize();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(UserByIdPipe)
  async findOne(@Param('id') user: Model<User>): Promise<UserSanitized> {
    return user.sanitize();
  }
}

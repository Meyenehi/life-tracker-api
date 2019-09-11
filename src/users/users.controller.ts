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
import { AuthGuard } from '@nestjs/passport';
import { User, UserSanitized } from './interfaces/user.interface';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { createUserSchema } from './validation';
import { JoiValidationPipe } from '../shared/joi.pipe';
import { UserByIdPipe } from './users.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new JoiValidationPipe(createUserSchema))
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(): Promise<UserSanitized[]> {
    return await this.usersService.findAll(true);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    return req.user;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(UserByIdPipe)
  async findOne(@Param('id') user: UserSanitized): Promise<UserSanitized> {
    return user;
  }
}

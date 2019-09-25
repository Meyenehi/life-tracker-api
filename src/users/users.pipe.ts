import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/users.interface';
import { UsersService } from './users.service';

@Injectable()
export class UserByIdPipe implements PipeTransform<any> {
  constructor(private readonly usersService: UsersService) {}

  async transform(
    id: string,
    metadata: ArgumentMetadata,
  ): Promise<Model<User>> {
    if (!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException();
    return await this.usersService.findOne(id);
  }
}

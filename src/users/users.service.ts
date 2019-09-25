import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, ConflictException } from '@nestjs/common';
import { User, UserCreate } from './interfaces/users.interface';
import { CreateUserDto } from './dtos/users.dto';
import { generateSalt, sha512 } from '../shared/utils';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { firstName, lastName, email, password } = createUserDto;
      const salt: string = generateSalt(16);
      const hash: string = sha512(password, salt);
      const userData: UserCreate = {
        firstName,
        lastName,
        email,
        salt,
        hash,
      };
      const user: Model<User> = new this.userModel(userData);
      return await user.save();
    } catch (err) {
      throw new ConflictException({
        error: 'Error creating user',
      });
    }
  }

  async findAll(): Promise<Model<User>[]> {
    const users: Model<User>[] = await this.userModel.find();
    return users;
  }

  async findOne(id: string): Promise<Model<User> | undefined> {
    const user: Model<User> = await this.userModel.findOne({ _id: id });
    if (!user) return undefined;
    return user;
  }

  async findOneByEmail(email: string): Promise<Model<User> | undefined> {
    const user: Model<User> = await this.userModel.findOne({ email });
    if (!user) return undefined;
    return user;
  }
}

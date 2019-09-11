import { Model } from 'mongoose';
import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserSanitized } from './interfaces/user.interface';
import { LoginDto, CreateUserDto } from './dto';
import { generateSalt, sha512 } from '../shared/utils';

@Injectable()
export class UsersService {
  constructor(@Inject('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { firstName, lastName, email, password } = createUserDto;
      const salt: string = generateSalt(16);
      const hash: string = sha512(password, salt);
      const userData: User = {
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

  async findAll(sanitized: boolean = false): Promise<User[] | UserSanitized[]> {
    const users: Model<User>[] = await this.userModel.find();
    if (!sanitized) return users;

    return users.map((user: Model<User>) => {
      return user.sanitize();
    });
  }

  async findOne(
    id: string,
    sanitized: boolean = false,
  ): Promise<User | UserSanitized | undefined> {
    const user: Model<User> = await this.userModel.findOne({ _id: id });
    if (!user) throw new NotFoundException();
    if (!sanitized) return user;

    return user.sanitize();
  }

  async findOneByEmail(
    email: string,
    sanitized: boolean = false,
  ): Promise<User | UserSanitized | undefined> {
    const user: Model<User> = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException();
    if (!sanitized) return user;

    return user.sanitize();
  }
}

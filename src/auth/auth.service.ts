import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/user.interface';
import { sha512 } from '../shared/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user: Model<User> = await this.usersService.findOneByEmail(email);
    if (!user) throw new UnauthorizedException();
    const hash = sha512(password, user.salt);
    if (user.hash === hash) return user.sanitize();
    return null;
  }

  async login(user: Model<User>) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

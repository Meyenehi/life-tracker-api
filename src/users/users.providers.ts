import { UserSchema } from './schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';

export const usersProviders = [
  MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
];

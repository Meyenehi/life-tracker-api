import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
      uri: config.get('DB_URL'),
      useNewUrlParser: true,
      useCreateIndex: true,
    }),
  }),
];

import * as mongoose from 'mongoose';
import { DATABASE_CONNECTION } from './constants';
import { ConfigService } from '../config/config.service';
import { NEST_CONFIG_PROVIDER } from '../config/constants';

export const databaseProviders = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (
      configService: ConfigService,
    ): Promise<typeof mongoose> =>
      await mongoose.connect(configService.get('DB_URL'), {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
    inject: [NEST_CONFIG_PROVIDER],
  },
];

import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { generateSalt, sha512 } from '../shared/utils';

describe('AuthService', () => {
  let service: AuthService;

  const testSalt = generateSalt(16);
  const testPassword = 'l05p011oSh3rm@no5';
  const testHash = sha512(testPassword, testSalt);
  const userMock = {
    firstName: 'Gustavo',
    lastName: 'Fring',
    email: 'gustavo.fring@test.com',
    salt: testSalt,
    hash: testHash,
  };

  class MockUsersService {
    findOneByEmail(email: string, password: string) {
      if (email === userMock.email) return userMock;
      return;
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.registerAsync({
          imports: [ConfigModule.forRoot()],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: '60m' },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersService, useClass: MockUsersService },
        {
          provide: ConfigService,
          useFactory: () => new ConfigService(),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user when validation is successful', async () => {
      const user = await service.validateUser(userMock.email, testPassword);
      expect(user).toMatchObject(userMock);
    });

    it('should return null when email is invalid', async () => {
      const user = await service.validateUser(
        'wrongemail@test.com',
        testPassword,
      );
      expect(user).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const user = await service.validateUser(userMock.email, 'wrongpass');
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an object with an access token', async () => {
      const response = await service.login(userMock);
      expect(response.access_token).toBeDefined();
    });
  });
});

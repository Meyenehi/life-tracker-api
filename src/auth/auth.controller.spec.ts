import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { JwtModule } from '@nestjs/jwt';

describe('Auth Controller', () => {
  let controller: AuthController;
  let spyService: AuthService;
  class MockUsersService {
    findOneByEmail(email: string, password: string) {
      if (email === testUser.email) return testUser;
      return;
    }
  }

  const testUser = {
    firstName: 'Gustavo',
    lastName: 'Fring',
    email: 'gustavo.fring@test.com',
  };

  const testLoginResponse = {
    access_token: 'xxx',
  };

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
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            login: jest.fn(() => testLoginResponse),
            validateUser: jest.fn(() => {
              return 'test'; // todo
            }),
          }),
        },
        { provide: UsersService, useClass: MockUsersService },
        {
          provide: ConfigService,
          useFactory: () => new ConfigService(),
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    spyService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login when passed valid params', async () => {
      await controller.login({ user: testUser });
      expect(spyService.login).toHaveBeenCalledWith(testUser);
    });
  });
});

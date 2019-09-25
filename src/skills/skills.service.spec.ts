import * as mongoose from 'mongoose';
import * as sinon from 'sinon';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Skill, Skills } from './interfaces/skills.interface';
import { SkillsService } from './skills.service';
import { skillsProviders } from './skills.providers';
import {
  CreateSkillDto,
  CreateSkillsDto,
  UpdateSkillDto,
} from './dtos/skills.dto';

describe('SkillsService', () => {
  let service: SkillsService;

  const userMock = {
    id: new mongoose.Types.ObjectId().toString(),
    firstName: 'Gustavo',
    lastName: 'Fring',
    email: 'gustavo.fring@test.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            const mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();
            return {
              uri: uri,
              useNewUrlParser: true,
              useCreateIndex: true,
            };
          },
        }),
        ...skillsProviders,
      ],
      providers: [
        SkillsService,
        {
          provide: ConfigService,
          useFactory: () => new ConfigService(),
        },
      ],
    }).compile();

    service = module.get<SkillsService>(SkillsService);
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new skill', async () => {
      const dto: CreateSkillDto = {
        name: 'Test Skill',
      };
      const newSkill: Skill[] = await service.create(userMock, dto);
      expect(newSkill[0].name).toEqual(dto.name);
      expect(newSkill[0].enabled).toBeTruthy();
    });

    it('should not create a new skill if exists', async () => {
      const dto: CreateSkillDto = {
        name: 'Test Skill',
      };
      const newSkill: Skill[] = await service.create(userMock, dto);
      expect(service.create(userMock, dto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });
});

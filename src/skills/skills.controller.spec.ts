import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { DatabaseModule } from '../database/database.module';

describe('Skills Controller', () => {
  let controller: SkillsController;

  beforeEach(async () => {
    const skillItemModel = {
      name: String,
    };
    const skillModel = {
      user: String,
      skills: [skillItemModel],
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [SkillsController],
      providers: [
        SkillsService,
        {
          provide: getModelToken('Skill'),
          useValue: skillModel,
        },
        {
          provide: getModelToken('SkillItem'),
          useValue: skillItemModel,
        },
      ],
    }).compile();

    controller = module.get<SkillsController>(SkillsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

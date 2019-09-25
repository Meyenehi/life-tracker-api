import { MongooseModule } from '@nestjs/mongoose';
import { SkillSchema, SkillItemSchema } from './schemas/skills.schema';

export const skillsProviders = [
  MongooseModule.forFeature([
    { name: 'Skill', schema: SkillSchema },
    { name: 'SkillItem', schema: SkillItemSchema },
  ]),
];

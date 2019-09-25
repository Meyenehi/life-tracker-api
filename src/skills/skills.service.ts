import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Skill, Skills } from './interfaces/skills.interface';
import { User } from '../users/interfaces/users.interface';
import {
  CreateSkillDto,
  CreateSkillsDto,
  UpdateSkillDto,
} from './dtos/skills.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectModel('Skill') private readonly skillModel: Model<Skills>,
    @InjectModel('SkillItem') private readonly skillItemModel: Model<Skill>,
  ) {}

  async create(
    user: Model<User>,
    createSkillDto: CreateSkillDto,
  ): Promise<Model<Skill>[]> {
    try {
      const { name } = createSkillDto;
      const skills = await checkIfExistsOrCreate(this.skillModel, user, {
        skills: {
          $elemMatch: {
            name,
            enabled: true,
          },
        },
      });

      enableOrPush(skills.skills, createSkillDto);
      const updated = await skills.save();
      return updated.skills;
    } catch (err) {
      throw err;
    }
  }

  async createBulk(user: Model<User>, createSkillsDto: CreateSkillsDto) {
    try {
      const names = createSkillsDto.skills.map(skill => skill.name);
      const skills = await checkIfExistsOrCreate(this.skillModel, user, {
        skills: {
          $elemMatch: {
            name: {
              $in: names,
            },
            enabled: true,
          },
        },
      });

      for (const createSkillDto of createSkillsDto.skills) {
        enableOrPush(skills.skills, createSkillDto);
      }
      return await skills.save();
    } catch (err) {
      throw err;
    }
  }

  async findAll(user: Model<User>): Promise<Model<Skill>[]> {
    const skills: Model<Skills> = await this.skillModel.findOne({
      user: user.id,
    });

    return skills ? skills.skills : [];
  }

  async findOne(user: Model<User>, id: string): Promise<Model<Skill>> {
    const skills: Model<Skills> = await this.skillModel.findOne({
      user: user.id,
    });
    if (!skills) throw new NotFoundException();
    const skill = skills.skills.id(id);
    if (!skill) throw new NotFoundException();
    return skill;
  }

  async updateOne(
    user: Model<User>,
    id: string,
    updateSkillDto: UpdateSkillDto,
  ): Promise<Model<Skill>> {
    const skills: Model<Skills> = await this.skillModel.findOneAndUpdate(
      {
        user: user.id,
        skills: { $elemMatch: { _id: id } },
      },
      { ...updateSkillDto },
      { new: true },
    );

    if (!skills) throw new NotFoundException();
    const skill = skills.skills.id(id);
    if (!skill) throw new NotFoundException();
    skill.name = updateSkillDto.name;
    const updatedSkills = await skills.save();
    return updatedSkills.skills;
  }

  async removeOne(user: Model<User>, id: string): Promise<Model<Skill>> {
    const update = await this.skillModel.updateOne(
      {
        user: user.id,
        skills: { $elemMatch: { _id: id, enabled: true } },
      },
      { 'skills.$.enabled': false },
      { new: true },
    );
    if (!update) throw new ConflictException();
    return;
  }
}

async function checkIfExistsOrCreate(model, user, query) {
  const exists = await model.findOne({ user: user.id, ...query });
  if (exists)
    throw new ConflictException({
      error: 'Duplicate skill',
    });

  let skills = await model.findOne({ user: user.id });
  if (!skills) {
    skills = new model({ user: user.id });
  }
  return skills;
}

async function enableOrPush(skills, createSkillDto) {
  const skill = skills.find(({ name }) => name === createSkillDto.name);
  if (skill) {
    skill.enabled = true;
  } else {
    skills.push(createSkillData(createSkillDto));
  }
}

function createSkillData(dto) {
  const { name } = dto;
  const skillData: Skill = {
    name,
    enabled: true,
  };
  return skillData;
}

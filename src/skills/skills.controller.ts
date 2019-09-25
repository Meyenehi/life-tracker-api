import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Request,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Skill } from './interfaces/skills.interface';
import { SkillsService } from './skills.service';
import {
  CreateSkillDto,
  CreateSkillsDto,
  UpdateSkillDto,
} from './dtos/skills.dto';
import {
  CreateSkillValidator,
  CreateSkillsValidator,
  UpdateSkillValidator,
} from './dtos/skills.validation';
import { JoiValidationPipe } from '../shared/joi.pipe';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Request() req,
    @Body(new JoiValidationPipe(CreateSkillValidator))
    createSkillDto: CreateSkillDto,
  ) {
    const skills = await this.skillsService.create(req.user, createSkillDto);
    const sanitized = skills ? skills.map(skill => skill.sanitize()) : [];
    return sanitized;
  }

  @Post('bulk')
  @UseGuards(AuthGuard('jwt'))
  async createBulk(
    @Request() req,
    @Body(new JoiValidationPipe(CreateSkillsValidator))
    createSkillsDto: CreateSkillsDto,
  ) {
    const skills = await this.skillsService.createBulk(
      req.user,
      createSkillsDto,
    );
    const sanitized = skills ? skills.map(skill => skill.sanitized()) : [];
    return sanitized;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Request() req): Promise<Skill[]> {
    const skills = await this.skillsService.findAll(req.user);
    const sanitized = skills ? skills.map(skill => skill.sanitize()) : [];
    return sanitized;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Request() req, @Param('id') id: string): Promise<Skill> {
    const skill = await this.skillsService.findOne(req.user, id);
    return skill.sanitize();
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateOne(
    @Request() req,
    @Param('id') id: string,
    @Body(new JoiValidationPipe(UpdateSkillValidator))
    updateSkillDto: UpdateSkillDto,
  ): Promise<Skill[]> {
    console.log('updateSkillDto', updateSkillDto);
    const skills = await this.skillsService.updateOne(
      req.user,
      id,
      updateSkillDto,
    );
    const sanitized = skills ? skills.map(skill => skill.sanitize()) : [];
    return sanitized;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async removeOne(@Request() req, @Param('id') id: string): Promise<void> {
    return await this.skillsService.removeOne(req.user, id);
  }
}

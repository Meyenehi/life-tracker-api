export class CreateSkillDto {
  readonly name: string;
}

export class CreateSkillsDto {
  readonly skills: [CreateSkillDto];
}

export class UpdateSkillDto {
  readonly name: string;
}

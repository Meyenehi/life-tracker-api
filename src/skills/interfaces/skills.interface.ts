export interface Skill {
  name: String;
  enabled: Boolean;
}

export interface Skills {
  user: String;
  skills: [Skill];
}

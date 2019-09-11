export interface UserSanitized {
  firstName: string;
  lastName: string;
  email: string;
}

export interface User extends UserSanitized {
  salt: string;
  hash: string;
}

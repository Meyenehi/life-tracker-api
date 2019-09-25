export interface UserBase {
  firstName: String;
  lastName: String;
  email: String;
}

export interface UserCreds {
  salt: String;
  hash: String;
}

export interface UserSanitized extends UserBase {
  id: String;
}

export interface User extends UserSanitized, UserCreds {}
export interface UserCreate extends UserBase, UserCreds {}

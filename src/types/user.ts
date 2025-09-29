export enum UserType {
  Standard = 'обычный',
  Pro = 'pro',
}

export type User = {
  name: string;
  email: string;
  avatar?: string;
  password: string;
  type: UserType;
};

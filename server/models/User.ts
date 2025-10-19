import { User as UserSchema, InsertUser as InsertUserSchema } from "../schema";

export type User = UserSchema;
export type InsertUser = InsertUserSchema;

export interface IUserModel {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

export class UserModel implements IUserModel {
  id: number;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;

  constructor(data: UserSchema) {
    this.id = data.id;
    this.username = data.username;
    this.password = data.password;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.phone = data.phone;
    this.role = data.role;
  }
}
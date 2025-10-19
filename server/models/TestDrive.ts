import { TestDrive as TestDriveSchema, InsertTestDrive as InsertTestDriveSchema } from "../schema";

export type TestDrive = TestDriveSchema;
export type InsertTestDrive = InsertTestDriveSchema;

export interface ITestDriveModel {
  id: number;
  userId?: number;
  vehicleId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  status: string;
  createdAt: Date;
}

export class TestDriveModel implements ITestDriveModel {
  id: number;
  userId?: number;
  vehicleId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  status: string;
  createdAt: Date;

  constructor(data: TestDriveSchema) {
    this.id = data.id;
    this.userId = data.userId;
    this.vehicleId = data.vehicleId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.date = data.date;
    this.time = data.time;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}
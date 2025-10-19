import { FinancingApplication as FinancingApplicationSchema, InsertFinancingApplication as InsertFinancingApplicationSchema } from "../schema";

export type FinancingApplication = FinancingApplicationSchema;
export type InsertFinancingApplication = InsertFinancingApplicationSchema;

export interface IFinancingApplicationModel {
  id: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  creditScore: string;
  employmentStatus?: string;
  annualIncome?: number;
  vehicleId?: number;
  status: string;
  createdAt: Date;
}

export class FinancingApplicationModel implements IFinancingApplicationModel {
  id: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  creditScore: string;
  employmentStatus?: string;
  annualIncome?: number;
  vehicleId?: number;
  status: string;
  createdAt: Date;

  constructor(data: FinancingApplicationSchema) {
    this.id = data.id;
    this.userId = data.userId;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.phone = data.phone;
    this.creditScore = data.creditScore;
    this.employmentStatus = data.employmentStatus;
    this.annualIncome = data.annualIncome;
    this.vehicleId = data.vehicleId;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}
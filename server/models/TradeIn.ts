import { TradeIn as TradeInSchema, InsertTradeIn as InsertTradeInSchema } from "../schema";

export type TradeIn = TradeInSchema;
export type InsertTradeIn = InsertTradeInSchema;

export interface ITradeInModel {
  id: number;
  userId?: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  estimatedValue?: number;
  status: string;
  createdAt: Date;
}

export class TradeInModel implements ITradeInModel {
  id: number;
  userId?: number;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  estimatedValue?: number;
  status: string;
  createdAt: Date;

  constructor(data: TradeInSchema) {
    this.id = data.id;
    this.userId = data.userId;
    this.year = data.year;
    this.make = data.make;
    this.model = data.model;
    this.trim = data.trim;
    this.mileage = data.mileage;
    this.condition = data.condition;
    this.estimatedValue = data.estimatedValue;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}
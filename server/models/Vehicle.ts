import { Vehicle as VehicleSchema, InsertVehicle as InsertVehicleSchema } from "../schema";

export type Vehicle = VehicleSchema;
export type InsertVehicle = InsertVehicleSchema;

export interface IVehicleModel {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  exteriorColor: string;
  interiorColor?: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  vin: string;
  description?: string;
  features?: string[];
  images?: string[];
  status: string;
  isFeatured: boolean;
  mpg?: number;
  range?: number;
  monthlyPayment?: number;
}

export class VehicleModel implements IVehicleModel {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  exteriorColor: string;
  interiorColor?: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  vin: string;
  description?: string;
  features?: string[];
  images?: string[];
  status: string;
  isFeatured: boolean;
  mpg?: number;
  range?: number;
  monthlyPayment?: number;

  constructor(data: VehicleSchema) {
    this.id = data.id;
    this.make = data.make;
    this.model = data.model;
    this.year = data.year;
    this.price = data.price;
    this.mileage = data.mileage;
    this.exteriorColor = data.exteriorColor;
    this.interiorColor = data.interiorColor;
    this.fuelType = data.fuelType;
    this.transmission = data.transmission;
    this.bodyType = data.bodyType;
    this.vin = data.vin;
    this.description = data.description;
    this.features = data.features;
    this.images = data.images;
    this.status = data.status;
    this.isFeatured = data.isFeatured;
    this.mpg = data.mpg;
    this.range = data.range;
    this.monthlyPayment = data.monthlyPayment;
  }
}
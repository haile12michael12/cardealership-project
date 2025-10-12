import { z } from "zod";

// User schema
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  role: z.string().default("customer"),
});

// Vehicle schema
export const insertVehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().int().min(1886).max(new Date().getFullYear() + 1),
  price: z.number().int().positive(),
  mileage: z.number().int().nonnegative(),
  exteriorColor: z.string().min(1),
  interiorColor: z.string().optional(),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  bodyType: z.string().min(1),
  vin: z.string().min(1),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  status: z.string().default("available"),
  isFeatured: z.boolean().default(false),
  mpg: z.number().int().optional(),
  range: z.number().int().optional(),
  monthlyPayment: z.number().int().optional(),
});

// Financing application schema
export const insertFinancingApplicationSchema = z.object({
  userId: z.number().int().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  creditScore: z.string().min(1),
  employmentStatus: z.string().optional(),
  annualIncome: z.number().int().optional(),
  vehicleId: z.number().int().optional(),
  status: z.string().default("pending"),
});

// Test drive schema
export const insertTestDriveSchema = z.object({
  userId: z.number().int().optional(),
  vehicleId: z.number().int(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  date: z.string().min(1), // In a real app, this would be a Date object
  time: z.string().min(1),
  status: z.string().default("scheduled"),
});

// Trade-in schema
export const insertTradeInSchema = z.object({
  userId: z.number().int().optional(),
  year: z.number().int().min(1886).max(new Date().getFullYear()),
  make: z.string().min(1),
  model: z.string().min(1),
  trim: z.string().optional(),
  mileage: z.number().int().nonnegative(),
  condition: z.string().min(1),
  estimatedValue: z.number().int().optional(),
  status: z.string().default("pending"),
});

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type InsertFinancingApplication = z.infer<typeof insertFinancingApplicationSchema>;
export type InsertTestDrive = z.infer<typeof insertTestDriveSchema>;
export type InsertTradeIn = z.infer<typeof insertTradeInSchema>;
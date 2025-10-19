import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  role: text("role").default("customer").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Vehicle schema
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  mileage: integer("mileage").notNull(),
  exteriorColor: text("exterior_color").notNull(),
  interiorColor: text("interior_color"),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  bodyType: text("body_type").notNull(),
  vin: text("vin").notNull().unique(),
  description: text("description"),
  features: text("features").array(),
  images: text("images").array(),
  status: text("status").default("available").notNull(),
  isFeatured: boolean("is_featured").default(false),
  mpg: integer("mpg"),
  range: integer("range"),
  monthlyPayment: integer("monthly_payment"),
  // Reservation and sales tracking fields
  reservedBy: integer("reserved_by"),
  reservedUntil: timestamp("reserved_until"),
  soldTo: integer("sold_to"),
  soldAt: timestamp("sold_at"),
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
});

// Financing application schema
export const financingApplications = pgTable("financing_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  creditScore: text("credit_score").notNull(),
  employmentStatus: text("employment_status"),
  annualIncome: integer("annual_income"),
  vehicleId: integer("vehicle_id"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFinancingApplicationSchema = createInsertSchema(financingApplications).omit({
  id: true,
  createdAt: true,
});

// Test drive schema
export const testDrives = pgTable("test_drives", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  vehicleId: integer("vehicle_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  status: text("status").default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestDriveSchema = createInsertSchema(testDrives).omit({
  id: true,
  createdAt: true,
});

// Trade-in schema
export const tradeIns = pgTable("trade_ins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  year: integer("year").notNull(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  trim: text("trim"),
  mileage: integer("mileage").notNull(),
  condition: text("condition").notNull(),
  estimatedValue: integer("estimated_value"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTradeInSchema = createInsertSchema(tradeIns).omit({
  id: true,
  estimatedValue: true,
  createdAt: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type FinancingApplication = typeof financingApplications.$inferSelect;
export type InsertFinancingApplication = z.infer<typeof insertFinancingApplicationSchema>;

export type TestDrive = typeof testDrives.$inferSelect;
export type InsertTestDrive = z.infer<typeof insertTestDriveSchema>;

export type TradeIn = typeof tradeIns.$inferSelect;
export type InsertTradeIn = z.infer<typeof insertTradeInSchema>;
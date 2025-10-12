"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertTradeInSchema = exports.insertTestDriveSchema = exports.insertFinancingApplicationSchema = exports.insertVehicleSchema = exports.insertUserSchema = void 0;
var zod_1 = require("zod");
// User schema
exports.insertUserSchema = zod_1.z.object({
    username: zod_1.z.string().min(1),
    password: zod_1.z.string().min(6),
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    phone: zod_1.z.string().optional(),
    role: zod_1.z.string().default("customer"),
});
// Vehicle schema
exports.insertVehicleSchema = zod_1.z.object({
    make: zod_1.z.string().min(1),
    model: zod_1.z.string().min(1),
    year: zod_1.z.number().int().min(1886).max(new Date().getFullYear() + 1),
    price: zod_1.z.number().int().positive(),
    mileage: zod_1.z.number().int().nonnegative(),
    exteriorColor: zod_1.z.string().min(1),
    interiorColor: zod_1.z.string().optional(),
    fuelType: zod_1.z.string().min(1),
    transmission: zod_1.z.string().min(1),
    bodyType: zod_1.z.string().min(1),
    vin: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    features: zod_1.z.array(zod_1.z.string()).optional(),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    status: zod_1.z.string().default("available"),
    isFeatured: zod_1.z.boolean().default(false),
    mpg: zod_1.z.number().int().optional(),
    range: zod_1.z.number().int().optional(),
    monthlyPayment: zod_1.z.number().int().optional(),
});
// Financing application schema
exports.insertFinancingApplicationSchema = zod_1.z.object({
    userId: zod_1.z.number().int().optional(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(1),
    creditScore: zod_1.z.string().min(1),
    employmentStatus: zod_1.z.string().optional(),
    annualIncome: zod_1.z.number().int().optional(),
    vehicleId: zod_1.z.number().int().optional(),
    status: zod_1.z.string().default("pending"),
});
// Test drive schema
exports.insertTestDriveSchema = zod_1.z.object({
    userId: zod_1.z.number().int().optional(),
    vehicleId: zod_1.z.number().int(),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(1),
    date: zod_1.z.string().min(1), // In a real app, this would be a Date object
    time: zod_1.z.string().min(1),
    status: zod_1.z.string().default("scheduled"),
});
// Trade-in schema
exports.insertTradeInSchema = zod_1.z.object({
    userId: zod_1.z.number().int().optional(),
    year: zod_1.z.number().int().min(1886).max(new Date().getFullYear()),
    make: zod_1.z.string().min(1),
    model: zod_1.z.string().min(1),
    trim: zod_1.z.string().optional(),
    mileage: zod_1.z.number().int().nonnegative(),
    condition: zod_1.z.string().min(1),
    estimatedValue: zod_1.z.number().int().optional(),
    status: zod_1.z.string().default("pending"),
});

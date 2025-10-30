import { z } from "zod";

export const VehicleSchema = z.object({
  id: z.string(),
  vin: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number().int(),
  price: z.number(),
  mileage: z.number().int().optional(),
  images: z.array(z.string()).default([])
});

export type Vehicle = z.infer<typeof VehicleSchema>;



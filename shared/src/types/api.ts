import { z } from "zod";

export const VehicleIdParamSchema = z.object({
  vehicleId: z.string().min(1)
});

export type VehicleIdParam = z.infer<typeof VehicleIdParamSchema>;

export const PaginatedQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export type PaginatedQuery = z.infer<typeof PaginatedQuerySchema>;



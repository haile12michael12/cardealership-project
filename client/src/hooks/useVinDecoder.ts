import { useQuery, useMutation } from "@tanstack/react-query";

export interface VehicleSpecs {
  vin: string;
  make: string;
  model: string;
  year: number;
  engine: string;
  transmission: string;
  bodyType: string;
  drivetrain: string;
  fuelType: string;
  doors: number;
  cylinders: number;
  displacement: string;
  manufacturedIn: string;
  plantCode: string;
  sequenceNumber: string;
  trim: string;
  color: string;
  features: string[];
}

export const useDecodeVin = (vin?: string) => {
  return useQuery<VehicleSpecs>({
    queryKey: ["vin-decode", vin],
    queryFn: async () => {
      if (!vin) {
        throw new Error("VIN is required");
      }
      
      const response = await fetch(`/api/vin/${vin}`);
      
      if (!response.ok) {
        throw new Error("Failed to decode VIN");
      }
      
      return response.json();
    },
    enabled: !!vin && vin.length === 17, // Only run if VIN is provided and valid length
  });
};

export const useDecodeVinMutation = () => {
  return useMutation<VehicleSpecs, Error, string>({
    mutationFn: async (vin: string) => {
      const response = await fetch("/api/vin/decode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vin }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to decode VIN");
      }
      
      return response.json();
    },
  });
};
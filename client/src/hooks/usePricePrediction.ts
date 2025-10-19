import { useQuery, useMutation } from "@tanstack/react-query";

export interface PricePrediction {
  predictedPrice: number;
  confidence: number;
  factors: any;
}

export interface PriceHistoryItem {
  date: string;
  price: number;
  volume: number;
}

export interface ComparableVehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  difference: number;
}

export interface VehicleSpecs {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  drivetrain: string;
  manufacturedIn: string;
  features: string[];
  [key: string]: any; // Allow additional properties
}

export const usePricePrediction = () => {
  return useMutation<PricePrediction, Error, VehicleSpecs>({
    mutationFn: async (vehicleSpecs: VehicleSpecs) => {
      const response = await fetch("/api/price-prediction/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleSpecs),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to predict price");
      }
      
      return response.json();
    },
  });
};

export const usePriceHistory = () => {
  return useMutation<PriceHistoryItem[], Error, VehicleSpecs>({
    mutationFn: async (vehicleSpecs: VehicleSpecs) => {
      const response = await fetch("/api/price-prediction/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleSpecs),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get price history");
      }
      
      return response.json();
    },
  });
};

export const useComparableVehicles = (limit: number = 5) => {
  return useMutation<ComparableVehicle[], Error, VehicleSpecs>({
    mutationFn: async (vehicleSpecs: VehicleSpecs) => {
      const response = await fetch(`/api/price-prediction/comparables?limit=${limit}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vehicleSpecs),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to get comparable vehicles");
      }
      
      return response.json();
    },
  });
};
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/shared/schema";

export interface UserPreferences {
  budget?: { min: number; max: number };
  bodyTypes?: string[];
  fuelTypes?: string[];
  makes?: string[];
  years?: { min: number; max: number };
  mileage?: { min: number; max: number };
  transmission?: string;
  features?: string[];
}

export const useRecommendations = (preferences: UserPreferences, limit: number = 10) => {
  return useQuery<Vehicle[]>({
    queryKey: ["recommendations", preferences, limit],
    queryFn: async () => {
      const response = await fetch("/api/recommendations/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      
      return response.json();
    },
    enabled: Object.keys(preferences).length > 0, // Only run if preferences are provided
  });
};

export const usePersonalizedRecommendations = (userId: number, limit: number = 10) => {
  return useQuery<Vehicle[]>({
    queryKey: ["personalized-recommendations", userId, limit],
    queryFn: async () => {
      const response = await fetch(`/api/recommendations/personalized/${userId}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch personalized recommendations");
      }
      
      return response.json();
    },
    enabled: !!userId, // Only run if userId is provided
  });
};
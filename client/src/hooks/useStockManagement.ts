import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Vehicle } from "@/shared/schema";

export const useUpdateStockStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId, status }: { vehicleId: number; status: string }) => {
      const response = await fetch(`/api/stock/${vehicleId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update stock status");
      }
      
      return response.json();
    },
    onSuccess: (updatedVehicle: Vehicle) => {
      // Invalidate and refetch vehicle queries
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${updatedVehicle.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
  });
};

export const useReserveVehicle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId, customerId, duration }: { vehicleId: number; customerId: number; duration?: number }) => {
      const response = await fetch(`/api/stock/${vehicleId}/reserve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId, duration }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to reserve vehicle");
      }
      
      return response.json();
    },
    onSuccess: (updatedVehicle: Vehicle) => {
      // Invalidate and refetch vehicle queries
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${updatedVehicle.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
  });
};

export const useReleaseReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId }: { vehicleId: number }) => {
      const response = await fetch(`/api/stock/${vehicleId}/release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to release reservation");
      }
      
      return response.json();
    },
    onSuccess: (updatedVehicle: Vehicle) => {
      // Invalidate and refetch vehicle queries
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${updatedVehicle.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
  });
};

export const useMarkAsSold = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ vehicleId, customerId }: { vehicleId: number; customerId: number }) => {
      const response = await fetch(`/api/stock/${vehicleId}/sold`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark vehicle as sold");
      }
      
      return response.json();
    },
    onSuccess: (updatedVehicle: Vehicle) => {
      // Invalidate and refetch vehicle queries
      queryClient.invalidateQueries({ queryKey: [`/api/vehicles/${updatedVehicle.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
  });
};
import { useQuery, QueryFunction } from "@tanstack/react-query";

interface AvailabilityParams {
  vehicleId: string;
  date: string;
  location: string;
}

interface AvailabilityResponse {
  available: boolean;
  availableSlots: number;
  totalSlots: number;
  bookedSlots: number;
}

export const useTestDriveAvailability = (params: AvailabilityParams) => {
  const queryFn: QueryFunction<AvailabilityResponse> = async () => {
    const res = await fetch(
      `/api/test-drives/availability?vehicleId=${params.vehicleId}&date=${params.date}&location=${params.location}`,
      { credentials: "include" }
    );
    
    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }
    
    return await res.json();
  };

  return useQuery<AvailabilityResponse>({
    queryKey: ["test-drive-availability", params],
    queryFn,
    enabled: !!params.vehicleId && !!params.date && !!params.location,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
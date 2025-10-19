import { useState, useEffect } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Vehicle } from "@/shared/schema";
import VehicleCard from "@/components/inventory/VehicleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface RecommendedVehiclesProps {
  userId?: number;
}

const RecommendedVehicles = ({ userId }: RecommendedVehiclesProps) => {
  const [preferences, setPreferences] = useState({
    budget: { min: 0, max: 100000 },
    bodyTypes: [] as string[],
    fuelTypes: [] as string[],
    makes: [] as string[],
  });
  
  // For demo purposes, we'll set some default preferences
  useEffect(() => {
    // In a real app, these would come from user profile or browsing history
    setPreferences({
      budget: { min: 20000, max: 50000 },
      bodyTypes: ["SUV", "Sedan"],
      fuelTypes: ["Gasoline", "Hybrid"],
      makes: ["BMW", "Toyota", "Honda"],
    });
  }, []);
  
  const { data: recommendedVehicles, isLoading, isError } = useRecommendations(preferences, 4);
  
  if (isError) {
    return (
      <Card className="bg-white rounded-lg shadow-md">
        <CardHeader>
          <CardTitle>Recommended Vehicles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Failed to load recommendations</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-white rounded-lg shadow-md">
      <CardHeader>
        <CardTitle>Recommended Vehicles</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="w-3/4 h-6 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-20 h-6" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="w-24 h-6" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendedVehicles && recommendedVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedVehicles.map((vehicle: Vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No recommendations available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedVehicles;
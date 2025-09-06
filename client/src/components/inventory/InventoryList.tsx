import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Vehicle } from "@shared/schema";
import VehicleCard from "./VehicleCard";
import VehicleFilters from "./VehicleFilters";
import { Skeleton } from "@/components/ui/skeleton";

const InventoryList = () => {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  
  // Parse URL parameters
  useEffect(() => {
    setSearchParams(new URLSearchParams(location.split("?")[1] || ""));
  }, [location]);
  
  // Build query string from search params
  const queryString = searchParams ? searchParams.toString() : "";
  
  // Fetch vehicles based on filters
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: [`/api/vehicles${queryString ? `?${queryString}` : ""}`],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <VehicleFilters />
        </div>
        
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">Our Inventory</h1>
          
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="w-3/4 h-6 mb-2" />
                  <Skeleton className="w-1/2 h-4 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-20 h-6" />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="w-24 h-6" />
                    <Skeleton className="w-16 h-4" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-10 h-10" />
                  </div>
                </div>
              ))}
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <span className="material-icons text-4xl text-gray-400 mb-4">search_off</span>
              <h2 className="text-2xl font-semibold mb-2">No vehicles found</h2>
              <p className="text-gray-600">
                Try adjusting your search filters to find more results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryList;

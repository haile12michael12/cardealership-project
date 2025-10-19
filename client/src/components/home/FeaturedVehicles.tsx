import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Vehicle } from "@/shared/schema";
import VehicleCard from "@/components/inventory/VehicleCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedVehicles = () => {
  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles?featured=true"],
  });

  return (
    <section id="inventory" className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Vehicles</h2>
          <Link href="/inventory">
            <a className="text-primary hover:text-primary-dark font-semibold flex items-center">
              View All <span className="material-icons ml-1">arrow_forward</span>
            </a>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            // Skeletons while loading
            Array.from({ length: 4 }).map((_, index) => (
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
            ))
          ) : vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No featured vehicles found.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;

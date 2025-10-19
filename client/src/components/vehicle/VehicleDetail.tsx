import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Check, Calculator, BarChart3 } from "lucide-react";
import VehicleGallery from "./VehicleGallery";
import StockManagement from "@/components/inventory/StockManagement";
import PricePrediction from "@/components/inventory/PricePrediction";

interface VehicleDetailProps {
  vehicleId: string;
}

const VehicleDetail = ({ vehicleId }: VehicleDetailProps) => {
  const [, navigate] = useLocation();
  
  // Fetch vehicle data
  const { data: vehicle, isLoading, error } = useQuery<Vehicle>({
    queryKey: [`/api/vehicles/${vehicleId}`],
  });
  
  if (isLoading) {
    return <VehicleDetailSkeleton />;
  }
  
  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Link href="/inventory">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inventory
            </Button>
          </Link>
        </div>
        <Card className="mt-4 p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Vehicle Not Found</h2>
          <p className="text-gray-500 mb-6">Sorry, the vehicle you're looking for is not available or has been removed.</p>
          <Link href="/inventory">
            <Button className="bg-primary text-white hover:bg-primary-dark">
              Browse Other Vehicles
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/inventory")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Inventory
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="md:w-2/3">
            <VehicleGallery images={vehicle.images || []} />
            
            <div className="mt-6">
              <h1 className="text-3xl font-bold mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <Badge variant="secondary" className="text-lg py-1">
                  {vehicle.bodyType}
                </Badge>
                <span className="text-2xl font-bold text-primary">
                  ${vehicle.price.toLocaleString()}
                </span>
                {vehicle.monthlyPayment && (
                  <span className="text-muted-foreground">
                    ${vehicle.monthlyPayment}/mo*
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-muted-foreground">Mileage</div>
                  <div className="font-semibold">{vehicle.mileage.toLocaleString()} mi</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-muted-foreground">Fuel Type</div>
                  <div className="font-semibold">{vehicle.fuelType}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-muted-foreground">Transmission</div>
                  <div className="font-semibold">{vehicle.transmission}</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-muted-foreground">Exterior Color</div>
                  <div className="font-semibold">{vehicle.exteriorColor}</div>
                </div>
              </div>
              
              {vehicle.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground">{vehicle.description}</p>
                </div>
              )}
              
              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Test Drive
                </Button>
                <Button variant="outline" className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Financing Calculator
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Trade-In Estimator
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stock Status</CardTitle>
              </CardHeader>
              <CardContent>
                <StockManagement vehicle={vehicle} userId={1} />
              </CardContent>
            </Card>
            
            {/* Price Prediction Component */}
            <PricePrediction 
              vehicleSpecs={{
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                mileage: vehicle.mileage,
                fuelType: vehicle.fuelType,
                transmission: vehicle.transmission,
                bodyType: vehicle.bodyType,
                drivetrain: "FWD", // Default value, would be actual value in real implementation
                manufacturedIn: "USA", // Default value, would be actual value in real implementation
                features: vehicle.features || [],
                price: vehicle.price
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for vehicle details
const VehicleDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-4">
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Skeleton className="h-96 w-full rounded-lg" />
          
          <div className="mt-6">
            <Skeleton className="h-12 w-full mb-4 rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="mb-6">
            <Skeleton className="h-40 w-full mb-4 rounded-lg" />
            <Skeleton className="h-60 w-full rounded-lg" />
          </div>
          
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
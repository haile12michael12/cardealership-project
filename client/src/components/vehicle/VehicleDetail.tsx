import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { ArrowLeft, Calendar, Check, DollarSign, Fuel, MapPin, Settings, Tag, Truck, Wrench } from "lucide-react";
import VehicleGallery from "./VehicleGallery";

interface VehicleDetailProps {
  vehicleId: string;
}

const VehicleDetail = ({ vehicleId }: VehicleDetailProps) => {
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

  // Format price
  const formattedPrice = vehicle.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  
  // Format monthly payment
  const formattedMonthlyPayment = vehicle.monthlyPayment
    ? vehicle.monthlyPayment.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      })
    : null;

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
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {/* Vehicle Gallery */}
          <VehicleGallery images={vehicle.images || []} />
          
          {/* Vehicle Details Tabs */}
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Vehicle Description</h3>
                  <p className="text-gray-700 mb-6">{vehicle.description || 'No description available for this vehicle.'}</p>
                  
                  <h3 className="text-xl font-bold mb-4">Key Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Body Type</p>
                        <p className="font-medium">{vehicle.bodyType}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Year</p>
                        <p className="font-medium">{vehicle.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Fuel Type</p>
                        <p className="font-medium">{vehicle.fuelType}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Transmission</p>
                        <p className="font-medium">{vehicle.transmission}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Mileage</p>
                        <p className="font-medium">{vehicle.mileage.toLocaleString()} mi</p>
                      </div>
                    </div>
                    {vehicle.mpg && (
                      <div className="flex items-center">
                        <Fuel className="h-5 w-5 text-primary mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Fuel Economy</p>
                          <p className="font-medium">{vehicle.mpg} MPG</p>
                        </div>
                      </div>
                    )}
                    {vehicle.range && (
                      <div className="flex items-center">
                        <span className="material-icons text-primary mr-2">electric_car</span>
                        <div>
                          <p className="text-sm text-gray-500">Range</p>
                          <p className="font-medium">{vehicle.range} miles</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">VIN</p>
                        <p className="font-medium">{vehicle.vin}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Vehicle Features</h3>
                  {vehicle.features && vehicle.features.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {vehicle.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No features listed for this vehicle.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specs" className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-4">Specifications</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Exterior</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Color</p>
                          <p className="font-medium">{vehicle.exteriorColor}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Body Style</p>
                          <p className="font-medium">{vehicle.bodyType}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Interior</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Color</p>
                          <p className="font-medium">{vehicle.interiorColor || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Performance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Fuel Type</p>
                          <p className="font-medium">{vehicle.fuelType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Transmission</p>
                          <p className="font-medium">{vehicle.transmission}</p>
                        </div>
                        {vehicle.mpg && (
                          <div>
                            <p className="text-sm text-gray-500">MPG</p>
                            <p className="font-medium">{vehicle.mpg} MPG</p>
                          </div>
                        )}
                        {vehicle.range && (
                          <div>
                            <p className="text-sm text-gray-500">Electric Range</p>
                            <p className="font-medium">{vehicle.range} miles</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:w-1/3">
          {/* Vehicle Summary Card */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-gray-600 mb-4">{vehicle.bodyType}</p>
              
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-primary">{formattedPrice}</span>
                {formattedMonthlyPayment && (
                  <span className="ml-2 text-sm text-gray-500">
                    or {formattedMonthlyPayment}/mo*
                  </span>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Exterior Color</span>
                  <span className="font-medium">{vehicle.exteriorColor}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Interior Color</span>
                  <span className="font-medium">{vehicle.interiorColor || 'Not specified'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Mileage</span>
                  <span className="font-medium">{vehicle.mileage.toLocaleString()} mi</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">VIN</span>
                  <span className="font-medium">{vehicle.vin}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Stock Status</span>
                  <Badge className={vehicle.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'}>
                    {vehicle.status === 'available' ? 'In Stock' : 'On Order'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link href={`/test-drive?vehicleId=${vehicle.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary-dark">
                    Schedule Test Drive
                  </Button>
                </Link>
                <Link href={`/financing?vehicleId=${vehicle.id}`}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    Apply for Financing
                  </Button>
                </Link>
                <Button variant="ghost" className="w-full">
                  <span className="material-icons mr-2">share</span>
                  Share Vehicle
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Dealer Information Card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-3">Contact Dealer</h3>
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <span className="material-icons text-primary mr-2">location_on</span>
                  <span>123 Dealership Way<br />Automotive City, AC 12345</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">phone</span>
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary mr-2">email</span>
                  <span>info@autodrive.com</span>
                </div>
              </div>
              <Button className="w-full">
                Request More Information
              </Button>
            </CardContent>
          </Card>
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

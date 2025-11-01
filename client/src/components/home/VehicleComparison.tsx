import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Vehicle } from "@/shared/schema";
import { Compare, X } from "lucide-react";

interface VehicleComparisonProps {
  vehicles: Vehicle[];
  selectedVehicles: string[];
  onVehicleSelect: (vehicleId: string) => void;
  onRemoveVehicle: (vehicleId: string) => void;
}

const VehicleComparison = ({ 
  vehicles, 
  selectedVehicles, 
  onVehicleSelect,
  onRemoveVehicle
}: VehicleComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedVehicleObjects = vehicles.filter(vehicle => 
    selectedVehicles.includes(vehicle.id.toString())
  );

  if (selectedVehicles.length === 0) {
    return (
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setIsOpen(true)}
        >
          <Compare className="h-4 w-4 mr-2" />
          Compare Vehicles
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Vehicle Comparison</h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "Hide" : "Show"} Comparison
        </Button>
      </div>
      
      {isOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Compare Vehicles
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => selectedVehicles.forEach(id => onRemoveVehicle(id))}
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedVehicleObjects.map(vehicle => (
                <div key={vehicle.id} className="border rounded-lg p-4 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => onRemoveVehicle(vehicle.id.toString())}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center mb-3">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-3">
                      <h4 className="font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                      <p className="text-sm text-gray-500">${vehicle.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mileage:</span>
                      <span>{vehicle.mileage?.toLocaleString() || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fuel Type:</span>
                      <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Transmission:</span>
                      <span>{vehicle.transmission}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedVehicles.length < 2 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">
                  Select another vehicle to compare
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {vehicles
                    .filter(vehicle => !selectedVehicles.includes(vehicle.id.toString()))
                    .map(vehicle => (
                      <Button
                        key={vehicle.id}
                        variant="outline"
                        size="sm"
                        className="text-xs h-10"
                        onClick={() => onVehicleSelect(vehicle.id.toString())}
                      >
                        {vehicle.make} {vehicle.model}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleComparison;
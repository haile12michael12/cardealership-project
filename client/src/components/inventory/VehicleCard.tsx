import { useState } from "react";
import { Link } from "wouter";
import { Vehicle } from "@/shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import StockManagement from "./StockManagement";

interface VehicleCardProps {
  vehicle: Vehicle;
  userId?: number;
}

const VehicleCard = ({ vehicle, userId }: VehicleCardProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  // Get default image or placeholder
  const defaultImage = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images[0] 
    : "https://via.placeholder.com/800x600?text=No+Image+Available";
  
  // Determine badge color and text
  let badgeText = "";
  let badgeClass = "";
  
  if (vehicle.isFeatured) {
    badgeText = "Featured";
    badgeClass = "bg-primary-light";
  } else if (vehicle.fuelType === "Electric") {
    badgeText = "Electric";
    badgeClass = "bg-success";
  } else if (vehicle.fuelType === "Hybrid") {
    badgeText = "Hybrid";
    badgeClass = "bg-success";
  } else {
    badgeText = "New Arrival";
    badgeClass = "bg-warning";
  }

  return (
    <div className="car-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <img 
        src={defaultImage} 
        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <Badge className={`${badgeClass} text-white text-xs font-semibold px-2 py-1 rounded`}>
            {badgeText}
          </Badge>
        </div>
        <p className="text-gray-600 mb-3">{vehicle.bodyType}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
            <span className="material-icons text-sm mr-1">speed</span> {vehicle.mileage.toLocaleString()} mi
          </span>
          
          {vehicle.fuelType === "Electric" ? (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
              <span className="material-icons text-sm mr-1">electric_car</span> {vehicle.range} mi range
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
              <span className="material-icons text-sm mr-1">local_gas_station</span> {vehicle.mpg} MPG
            </span>
          )}
          
          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center">
            <span className="material-icons text-sm mr-1">palette</span> {vehicle.exteriorColor}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-lg">${vehicle.price.toLocaleString()}</span>
          {vehicle.monthlyPayment && (
            <span className="text-sm text-gray-500">${vehicle.monthlyPayment}/mo*</span>
          )}
        </div>
        <div className="mb-4">
          <StockManagement vehicle={vehicle} userId={userId} />
        </div>
        <div className="flex space-x-2">
          <Link href={`/inventory/${vehicle.id}`}>
            <Button className="bg-primary text-white flex-1 py-2 rounded hover:bg-primary-dark transition">
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            className={`border border-gray-300 p-2 rounded ${isFavorite ? 'bg-red-50' : 'hover:bg-gray-100'} transition`}
            onClick={toggleFavorite}
          >
            <Heart className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
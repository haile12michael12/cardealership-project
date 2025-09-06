import { useParams } from "wouter";
import VehicleDetail from "@/components/vehicle/VehicleDetail";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@shared/schema";
import { Helmet } from 'react-helmet';

const VehiclePage = () => {
  const { id } = useParams();
  
  // Fetch vehicle data for meta info
  const { data: vehicle } = useQuery<Vehicle>({
    queryKey: id ? [`/api/vehicles/${id}`] : ['skip-query'],
    enabled: !!id,
  });

  return (
    <>
      <Helmet>
        <title>
          {vehicle 
            ? `${vehicle.year} ${vehicle.make} ${vehicle.model} | AutoDrive` 
            : "Vehicle Details | AutoDrive"}
        </title>
        <meta 
          name="description" 
          content={vehicle 
            ? `Explore the ${vehicle.year} ${vehicle.make} ${vehicle.model}. View specifications, features, and schedule a test drive today.`
            : "View detailed vehicle information, specifications, and features. Schedule a test drive or apply for financing."
          }
        />
      </Helmet>
      
      <div className="py-6 bg-gray-50">
        <VehicleDetail vehicleId={id} />
      </div>
    </>
  );
};

export default VehiclePage;

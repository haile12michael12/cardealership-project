import { useEffect, useState } from "react";
import VirtualShowroomViewer from "@/components/showroom/VirtualShowroomViewer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { VIRTUAL_SHOWROOM_BENEFITS } from "@/lib/constants";
import { Helmet } from 'react-helmet';

const VirtualShowroomPage = () => {
  const [vehicleId, setVehicleId] = useState<string | undefined>();
  
  // Get vehicleId from URL params if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("vehicleId");
    if (id) {
      setVehicleId(id);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Virtual Showroom | AutoDrive</title>
        <meta 
          name="description" 
          content="Experience our interactive virtual showroom. Explore vehicles in 360° detail from the comfort of your home."
        />
      </Helmet>
      
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Virtual Showroom Experience</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our vehicles in stunning detail without leaving your home. Get a 360° view of our inventory and discover all features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <VirtualShowroomViewer vehicleId={vehicleId} />
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-4">Experience Benefits</h3>
                <ul className="space-y-3">
                  {VIRTUAL_SHOWROOM_BENEFITS.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="material-icons text-primary mr-2">check_circle</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Alert>
                <InfoIcon className="h-5 w-5" />
                <AlertTitle>Need Assistance?</AlertTitle>
                <AlertDescription className="mt-2">
                  Our virtual sales representatives are available to guide you through the showroom experience. Click the chat bubble to connect with an expert.
                </AlertDescription>
              </Alert>
              
              <div className="bg-primary text-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mb-3">Ready for the Real Thing?</h3>
                <p className="mb-4">
                  After exploring our virtual showroom, experience the real thing with a test drive.
                </p>
                <a 
                  href="/test-drive" 
                  className="bg-white text-primary block w-full text-center py-2 rounded-md font-semibold hover:bg-gray-100 transition"
                >
                  Schedule a Test Drive
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VirtualShowroomPage;

import { useEffect, useState } from "react";
import TestDriveForm from "@/components/test-drive/TestDriveForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { TEST_DRIVE_BENEFITS } from "@/lib/constants";
import { Helmet } from 'react-helmet';

const TestDrive = () => {
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
        <title>Schedule a Test Drive | AutoDrive</title>
        <meta 
          name="description" 
          content="Schedule a test drive with AutoDrive. Experience your dream car firsthand with our flexible scheduling options."
        />
      </Helmet>
      
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">Schedule a Test Drive</h1>
            <p className="text-center text-gray-600 mb-8">
              Experience your dream car firsthand. Select a date and time that works for you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <TestDriveForm vehicleId={vehicleId} />
              </div>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Test Drive Benefits</h3>
                  <ul className="space-y-3">
                    {TEST_DRIVE_BENEFITS.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="material-icons text-primary mr-2">
                          {index === 0 ? "event_available" : index === 1 ? "route" : "person"}
                        </span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Alert>
                  <InfoIcon className="h-5 w-5" />
                  <AlertTitle>What to Bring</AlertTitle>
                  <AlertDescription className="mt-2">
                    <ul className="list-disc ml-4 mt-1 space-y-1">
                      <li>Valid driver's license</li>
                      <li>Proof of insurance</li>
                      <li>List of questions or features you want to check</li>
                    </ul>
                  </AlertDescription>
                </Alert>
                
                <img 
                  src="https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=800" 
                  alt="Person test driving a car" 
                  className="rounded-lg shadow-lg mt-6 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestDrive;

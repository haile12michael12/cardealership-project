import { useEffect, useState } from "react";
import FinancingForm from "@/components/financing/FinancingForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { FINANCING_BENEFITS } from "@/lib/constants";
import { Helmet } from 'react-helmet';

const Financing = () => {
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
        <title>Financing Application | AutoDrive</title>
        <meta 
          name="description" 
          content="Apply for financing with AutoDrive. Get pre-approved in minutes with competitive rates and flexible terms."
        />
      </Helmet>
      
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">Financing Application</h1>
            <p className="text-center text-gray-600 mb-8">
              Get pre-approved for financing in minutes with competitive rates and flexible terms.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <FinancingForm vehicleId={vehicleId} />
              </div>
              
              <div className="space-y-6">
                <Alert className="bg-primary/10 border-primary/20">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <AlertTitle className="text-primary">Easy Application Process</AlertTitle>
                  <AlertDescription className="mt-2">
                    Complete our simple financing application to get pre-approved in minutes.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4">Financing Benefits</h3>
                  <ul className="space-y-3">
                    {FINANCING_BENEFITS.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="material-icons text-primary mr-2">check_circle</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Alert>
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Credit Score Impact</AlertTitle>
                  <AlertDescription className="mt-2">
                    Applying for pre-approval won't affect your credit score. We use a soft credit pull for pre-qualification.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Financing;

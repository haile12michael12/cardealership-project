import VinDecoder from "@/components/inventory/VinDecoder";
import { Helmet } from "react-helmet";

const VinDecoderPage = () => {
  return (
    <>
      <Helmet>
        <title>VIN Decoder - AutoDrive</title>
        <meta 
          name="description" 
          content="Decode any Vehicle Identification Number (VIN) to get detailed vehicle specifications, history, and information."
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">VIN Decoder</h1>
          <p className="text-muted-foreground">
            Enter any 17-character Vehicle Identification Number to get detailed vehicle specifications
          </p>
        </div>
        
        <VinDecoder />
      </div>
    </>
  );
};

export default VinDecoderPage;
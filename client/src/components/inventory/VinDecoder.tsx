import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useDecodeVinMutation } from "@/hooks/useVinDecoder";
import { VehicleSpecs } from "@/hooks/useVinDecoder";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const VinDecoder = () => {
  const [vin, setVin] = useState("");
  const [vehicleSpecs, setVehicleSpecs] = useState<VehicleSpecs | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const decodeVin = useDecodeVinMutation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVehicleSpecs(null);
    
    if (!vin) {
      setError("Please enter a VIN");
      return;
    }
    
    if (vin.length !== 17) {
      setError("VIN must be 17 characters long");
      return;
    }
    
    try {
      const specs = await decodeVin.mutateAsync(vin.toUpperCase());
      setVehicleSpecs(specs);
    } catch (err: any) {
      setError(err.message || "Failed to decode VIN");
    }
  };
  
  const formatVin = (value: string) => {
    // Remove non-alphanumeric characters and convert to uppercase
    return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };
  
  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedVin = formatVin(e.target.value);
    setVin(formattedVin);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>VIN Decoder</CardTitle>
        <CardDescription>
          Enter a Vehicle Identification Number to get detailed vehicle specifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">Vehicle Identification Number (VIN)</Label>
            <Input
              id="vin"
              value={vin}
              onChange={handleVinChange}
              placeholder="Enter 17-character VIN"
              maxLength={17}
              className="uppercase"
            />
            <p className="text-sm text-muted-foreground">
              Example: 1HGCM826XA0045678
            </p>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={decodeVin.isPending || vin.length !== 17}
            className="w-full"
          >
            {decodeVin.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decoding...
              </>
            ) : (
              "Decode VIN"
            )}
          </Button>
        </form>
        
        {vehicleSpecs && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Vehicle Specifications</h3>
              <Badge variant="secondary" className="font-mono">
                {vehicleSpecs.vin}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Basic Information</h4>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Make</TableCell>
                      <TableCell>{vehicleSpecs.make}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Model</TableCell>
                      <TableCell>{vehicleSpecs.model}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Year</TableCell>
                      <TableCell>{vehicleSpecs.year}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Body Type</TableCell>
                      <TableCell>{vehicleSpecs.bodyType}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Trim</TableCell>
                      <TableCell>{vehicleSpecs.trim}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Engine & Performance</h4>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Engine</TableCell>
                      <TableCell>{vehicleSpecs.engine}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Displacement</TableCell>
                      <TableCell>{vehicleSpecs.displacement}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Cylinders</TableCell>
                      <TableCell>{vehicleSpecs.cylinders}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Transmission</TableCell>
                      <TableCell>{vehicleSpecs.transmission}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Drivetrain</TableCell>
                      <TableCell>{vehicleSpecs.drivetrain}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Additional Information</h4>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Fuel Type</TableCell>
                    <TableCell>{vehicleSpecs.fuelType}</TableCell>
                    <TableCell className="font-medium">Doors</TableCell>
                    <TableCell>{vehicleSpecs.doors}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Manufactured In</TableCell>
                    <TableCell>{vehicleSpecs.manufacturedIn}</TableCell>
                    <TableCell className="font-medium">Plant Code</TableCell>
                    <TableCell>{vehicleSpecs.plantCode}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Color</TableCell>
                    <TableCell>{vehicleSpecs.color}</TableCell>
                    <TableCell className="font-medium">Sequence Number</TableCell>
                    <TableCell>{vehicleSpecs.sequenceNumber}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {vehicleSpecs.features.map((feature, index) => (
                  <Badge key={index} variant="outline">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Vehicle information successfully decoded</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VinDecoder;
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCw, ZoomIn, ZoomOut, Maximize, Info, X } from "lucide-react";

interface VirtualShowroomViewerProps {
  vehicleId?: string;
}

const VirtualShowroomViewer = ({ vehicleId }: VirtualShowroomViewerProps) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | undefined>(vehicleId);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const rotationInterval = useRef<number | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Fetch all vehicles for the selector
  const { data: vehicles, isLoading: loadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });
  
  // Fetch the selected vehicle details
  const { data: selectedVehicle, isLoading: loadingSelectedVehicle } = useQuery<Vehicle>({
    queryKey: selectedVehicleId ? [`/api/vehicles/${selectedVehicleId}`] : ['skip-query'],
    enabled: !!selectedVehicleId,
  });
  
  // Set up the angles for the 360 view (8 images representing different angles)
  const angles = Array.from({ length: 8 }, (_, i) => i * 45);
  
  // Update selected vehicle when prop changes
  useEffect(() => {
    if (vehicleId) {
      setSelectedVehicleId(vehicleId);
    }
  }, [vehicleId]);
  
  // Auto-rotation effect
  useEffect(() => {
    if (isRotating) {
      rotationInterval.current = window.setInterval(() => {
        setCurrentAngle(prev => (prev + 45) % 360);
      }, 1000);
    } else if (rotationInterval.current) {
      clearInterval(rotationInterval.current);
      rotationInterval.current = null;
    }
    
    return () => {
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current);
      }
    };
  }, [isRotating]);
  
  // Get the appropriate image based on the current angle
  const getCurrentImage = () => {
    // In a real implementation, these would be actual 360° view images
    // For this demo, we use a single image from the vehicle
    const images = selectedVehicle?.images || [];
    
    if (images.length === 0) {
      return "https://via.placeholder.com/800x600?text=No+Image+Available";
    }
    
    // Use the first image as a placeholder for all angles
    return images[0];
  };
  
  const handleVehicleChange = (id: string) => {
    setSelectedVehicleId(id);
    setCurrentAngle(0);
    setZoom(1);
  };
  
  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };
  
  const handleZoomIn = () => {
    if (zoom < 2) {
      setZoom(zoom + 0.2);
    }
  };
  
  const handleZoomOut = () => {
    if (zoom > 0.6) {
      setZoom(zoom - 0.2);
    }
  };
  
  const resetView = () => {
    setCurrentAngle(0);
    setZoom(1);
  };
  
  // Demo hotspots for the selected vehicle
  const hotspots = [
    { 
      id: 1, 
      x: 30, 
      y: 40, 
      title: "LED Headlights", 
      description: "Advanced LED headlights provide superior visibility and modern styling."
    },
    { 
      id: 2, 
      x: 70, 
      y: 60, 
      title: "Panoramic Sunroof", 
      description: "Expansive panoramic sunroof lets in natural light and provides an open-air experience."
    },
    { 
      id: 3, 
      x: 50, 
      y: 30, 
      title: "Premium Wheels", 
      description: "Stylish alloy wheels enhance both performance and aesthetics."
    }
  ];
  
  // If no vehicle is selected and we have vehicles data, default to the first one
  useEffect(() => {
    if (!selectedVehicleId && vehicles && vehicles.length > 0) {
      setSelectedVehicleId(vehicles[0].id.toString());
    }
  }, [selectedVehicleId, vehicles]);
  
  if (loadingVehicles) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[500px] w-full rounded-lg" />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {vehicles?.map(vehicle => (
          <Button
            key={vehicle.id}
            variant={selectedVehicleId === vehicle.id.toString() ? "default" : "outline"}
            onClick={() => handleVehicleChange(vehicle.id.toString())}
            className="mb-2"
          >
            {vehicle.year} {vehicle.make} {vehicle.model}
          </Button>
        ))}
      </div>
      
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          {loadingSelectedVehicle ? (
            <Skeleton className="h-[500px] w-full" />
          ) : (
            <div 
              ref={viewerRef}
              className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gray-900"
            >
              <div 
                className="transition-transform duration-300 ease-in-out"
                style={{ 
                  transform: `scale(${zoom})`,
                  cursor: 'grab'
                }}
              >
                <img 
                  src={getCurrentImage()} 
                  alt={selectedVehicle ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}` : 'Vehicle'} 
                  className="max-h-[500px] object-contain" 
                />
              </div>
              
              {/* Angle indicator */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                View Angle: {currentAngle}°
              </div>
              
              {/* Controls */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={toggleRotation}
                  className={`${isRotating ? 'bg-primary text-white' : 'bg-white/80 text-neutral-dark'} rounded-full hover:bg-white transition`}
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={handleZoomIn}
                  className="bg-white/80 text-neutral-dark rounded-full hover:bg-white transition"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={handleZoomOut}
                  className="bg-white/80 text-neutral-dark rounded-full hover:bg-white transition"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={resetView}
                  className="bg-white/80 text-neutral-dark rounded-full hover:bg-white transition"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  onClick={() => setShowInfo(!showInfo)}
                  className={`${showInfo ? 'bg-primary text-white' : 'bg-white/80 text-neutral-dark'} rounded-full hover:bg-white transition`}
                >
                  <Info className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Rotation control */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-1 py-1 rounded-full flex items-center">
                {angles.map(angle => (
                  <button
                    key={angle}
                    onClick={() => setCurrentAngle(angle)}
                    className={`w-3 h-3 mx-1 rounded-full ${currentAngle === angle ? 'bg-primary' : 'bg-white/50'}`}
                  />
                ))}
              </div>
              
              {/* Information hotspots */}
              {showInfo && hotspots.map(hotspot => (
                <Dialog key={hotspot.id}>
                  <DialogTrigger asChild>
                    <button
                      className="absolute bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center animate-pulse hover:animate-none"
                      style={{ 
                        left: `${hotspot.x}%`, 
                        top: `${hotspot.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <span className="material-icons text-sm">add</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold">{hotspot.title}</h4>
                      <p>{hotspot.description}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedVehicle && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-2">
            {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
          </h2>
          <p className="text-gray-600 mb-4">{selectedVehicle.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">${selectedVehicle.price.toLocaleString()}</span>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => window.location.href = `/inventory/${selectedVehicle.id}`}
              >
                View Details
              </Button>
              <Button 
                className="bg-primary hover:bg-primary-dark text-white"
                onClick={() => window.location.href = `/test-drive?vehicleId=${selectedVehicle.id}`}
              >
                Schedule Test Drive
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold mb-2">Virtual Showroom Instructions</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <RotateCw className="h-5 w-5 text-primary mr-2 mt-0.5" />
            <span>Click the rotate button to start/stop automatic rotation</span>
          </li>
          <li className="flex items-start">
            <ZoomIn className="h-5 w-5 text-primary mr-2 mt-0.5" />
            <span>Use zoom buttons to get a closer look at the vehicle</span>
          </li>
          <li className="flex items-start">
            <Info className="h-5 w-5 text-primary mr-2 mt-0.5" />
            <span>Toggle information hotspots to learn about vehicle features</span>
          </li>
          <li className="flex items-start">
            <span className="material-icons text-primary mr-2">touch_app</span>
            <span>Click the angle dots at the bottom to view specific angles</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VirtualShowroomViewer;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  useUpdateStockStatus, 
  useReserveVehicle, 
  useReleaseReservation, 
  useMarkAsSold 
} from "@/hooks/useStockManagement";
import { Vehicle } from "@/shared/schema";
import { useToast } from "@/hooks/use-toast";

interface StockManagementProps {
  vehicle: Vehicle;
  userId?: number;
}

const StockManagement = ({ vehicle, userId }: StockManagementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(vehicle.status);
  
  const { toast } = useToast();
  
  const updateStockStatus = useUpdateStockStatus();
  const reserveVehicle = useReserveVehicle();
  const releaseReservation = useReleaseReservation();
  const markAsSold = useMarkAsSold();
  
  const handleStatusChange = async () => {
    try {
      await updateStockStatus.mutateAsync({ 
        vehicleId: vehicle.id, 
        status: newStatus 
      });
      
      toast({
        title: "Success",
        description: "Vehicle status updated successfully",
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update vehicle status",
        variant: "destructive",
      });
    }
  };
  
  const handleReserve = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to reserve a vehicle",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await reserveVehicle.mutateAsync({ 
        vehicleId: vehicle.id, 
        customerId: userId,
        duration: 1440 // 24 hours
      });
      
      toast({
        title: "Success",
        description: "Vehicle reserved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reserve vehicle",
        variant: "destructive",
      });
    }
  };
  
  const handleRelease = async () => {
    try {
      await releaseReservation.mutateAsync({ 
        vehicleId: vehicle.id 
      });
      
      toast({
        title: "Success",
        description: "Reservation released successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to release reservation",
        variant: "destructive",
      });
    }
  };
  
  const handleMarkAsSold = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to mark a vehicle as sold",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await markAsSold.mutateAsync({ 
        vehicleId: vehicle.id, 
        customerId: userId
      });
      
      toast({
        title: "Success",
        description: "Vehicle marked as sold",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark vehicle as sold",
        variant: "destructive",
      });
    }
  };
  
  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "reserved":
        return "bg-yellow-100 text-yellow-800";
      case "sold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(vehicle.status)}`}>
        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
      </span>
      
      {userId && (
        <>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Stock for {vehicle.year} {vehicle.make} {vehicle.model}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="incoming">Incoming</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleStatusChange}
                    disabled={updateStockStatus.isPending}
                  >
                    {updateStockStatus.isPending ? "Updating..." : "Update Status"}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {vehicle.status === "available" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReserve}
              disabled={reserveVehicle.isPending}
            >
              {reserveVehicle.isPending ? "Reserving..." : "Reserve"}
            </Button>
          )}
          
          {vehicle.status === "reserved" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRelease}
              disabled={releaseReservation.isPending}
            >
              {releaseReservation.isPending ? "Releasing..." : "Release"}
            </Button>
          )}
          
          {vehicle.status !== "sold" && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAsSold}
              disabled={markAsSold.isPending}
            >
              {markAsSold.isPending ? "Marking..." : "Mark as Sold"}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default StockManagement;
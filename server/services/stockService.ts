import { Vehicle } from "../schema";
import { storage } from "../storage";

export class StockService {
  private static listeners: Array<(vehicle: Vehicle) => void> = [];
  
  /**
   * Subscribe to stock updates
   * @param callback Function to call when stock changes
   * @returns Unsubscribe function
   */
  static subscribe(callback: (vehicle: Vehicle) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
  
  /**
   * Notify all subscribers of a stock change
   * @param vehicle Updated vehicle
   */
  private static notifySubscribers(vehicle: Vehicle) {
    this.listeners.forEach(callback => {
      try {
        callback(vehicle);
      } catch (error) {
        console.error("Error notifying stock subscriber:", error);
      }
    });
  }
  
  /**
   * Update vehicle stock status
   * @param vehicleId ID of the vehicle to update
   * @param status New status ('available', 'sold', 'reserved', etc.)
   * @returns Updated vehicle or null if not found
   */
  static async updateStockStatus(vehicleId: number, status: string): Promise<Vehicle | null> {
    try {
      const vehicle = await storage.getVehicle(vehicleId);
      
      if (!vehicle) {
        return null;
      }
      
      const updatedVehicle = await storage.updateVehicle(vehicleId, { status });
      
      if (updatedVehicle) {
        // Notify subscribers of the stock change
        this.notifySubscribers(updatedVehicle);
      }
      
      return updatedVehicle || null;
    } catch (error) {
      console.error("Error updating stock status:", error);
      return null;
    }
  }
  
  /**
   * Reserve a vehicle for a customer
   * @param vehicleId ID of the vehicle to reserve
   * @param customerId ID of the customer making the reservation
   * @param duration Duration of reservation in minutes (default: 24 hours)
   * @returns Updated vehicle or null if not found
   */
  static async reserveVehicle(vehicleId: number, customerId: number, duration: number = 1440): Promise<Vehicle | null> {
    try {
      const vehicle = await storage.getVehicle(vehicleId);
      
      if (!vehicle) {
        return null;
      }
      
      // Check if vehicle is available for reservation
      if (vehicle.status !== 'available') {
        throw new Error(`Vehicle is not available for reservation (current status: ${vehicle.status})`);
      }
      
      // Update vehicle status to reserved
      const updatedVehicle = await storage.updateVehicle(vehicleId, { 
        status: 'reserved',
        reservedBy: customerId,
        reservedUntil: new Date(Date.now() + duration * 60000) // Convert minutes to milliseconds
      });
      
      if (updatedVehicle) {
        // Notify subscribers of the stock change
        this.notifySubscribers(updatedVehicle);
        
        // Set up automatic release of reservation after duration
        setTimeout(async () => {
          const currentVehicle = await storage.getVehicle(vehicleId);
          if (currentVehicle && currentVehicle.status === 'reserved' && currentVehicle.reservedBy === customerId) {
            await this.releaseReservation(vehicleId);
          }
        }, duration * 60000);
      }
      
      return updatedVehicle || null;
    } catch (error) {
      console.error("Error reserving vehicle:", error);
      return null;
    }
  }
  
  /**
   * Release a vehicle reservation
   * @param vehicleId ID of the vehicle to release
   * @returns Updated vehicle or null if not found
   */
  static async releaseReservation(vehicleId: number): Promise<Vehicle | null> {
    try {
      const vehicle = await storage.getVehicle(vehicleId);
      
      if (!vehicle) {
        return null;
      }
      
      // Only release if currently reserved
      if (vehicle.status !== 'reserved') {
        throw new Error(`Vehicle is not reserved (current status: ${vehicle.status})`);
      }
      
      // Update vehicle status back to available
      const updatedVehicle = await storage.updateVehicle(vehicleId, { 
        status: 'available',
        reservedBy: null,
        reservedUntil: null
      });
      
      if (updatedVehicle) {
        // Notify subscribers of the stock change
        this.notifySubscribers(updatedVehicle);
      }
      
      return updatedVehicle || null;
    } catch (error) {
      console.error("Error releasing reservation:", error);
      return null;
    }
  }
  
  /**
   * Mark a vehicle as sold
   * @param vehicleId ID of the vehicle to mark as sold
   * @param customerId ID of the customer who purchased the vehicle
   * @returns Updated vehicle or null if not found
   */
  static async markAsSold(vehicleId: number, customerId: number): Promise<Vehicle | null> {
    try {
      const vehicle = await storage.getVehicle(vehicleId);
      
      if (!vehicle) {
        return null;
      }
      
      // Update vehicle status to sold
      const updatedVehicle = await storage.updateVehicle(vehicleId, { 
        status: 'sold',
        soldTo: customerId,
        soldAt: new Date()
      });
      
      if (updatedVehicle) {
        // Notify subscribers of the stock change
        this.notifySubscribers(updatedVehicle);
      }
      
      return updatedVehicle || null;
    } catch (error) {
      console.error("Error marking vehicle as sold:", error);
      return null;
    }
  }
}
import { Vehicle } from "../schema";
import { storage } from "../storage";

export interface UserPreferences {
  budget?: { min: number; max: number };
  bodyTypes?: string[];
  fuelTypes?: string[];
  makes?: string[];
  years?: { min: number; max: number };
  mileage?: { min: number; max: number };
  transmission?: string;
  features?: string[];
}

export class RecommendationService {
  /**
   * Get recommended vehicles based on user preferences
   * @param preferences User preferences for vehicle selection
   * @param limit Maximum number of recommendations to return
   * @returns Array of recommended vehicles
   */
  static async getRecommendations(preferences: UserPreferences, limit: number = 10): Promise<Vehicle[]> {
    // Get all available vehicles
    const allVehicles = await storage.getVehicles({ status: "available" });
    
    // Score each vehicle based on how well it matches preferences
    const scoredVehicles = allVehicles.map(vehicle => ({
      vehicle,
      score: this.calculateMatchScore(vehicle, preferences)
    }));
    
    // Sort by score (highest first) and take top N
    return scoredVehicles
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.vehicle);
  }
  
  /**
   * Calculate how well a vehicle matches user preferences
   * @param vehicle The vehicle to score
   * @param preferences User preferences
   * @returns Match score between 0 and 100
   */
  private static calculateMatchScore(vehicle: Vehicle, preferences: UserPreferences): number {
    let score = 0;
    let totalWeight = 0;
    
    // Price match (30% weight)
    if (preferences.budget) {
      totalWeight += 30;
      score += this.calculatePriceMatch(vehicle.price, preferences.budget) * 30;
    }
    
    // Body type match (15% weight)
    if (preferences.bodyTypes && preferences.bodyTypes.length > 0) {
      totalWeight += 15;
      score += (preferences.bodyTypes.includes(vehicle.bodyType) ? 15 : 0);
    }
    
    // Fuel type match (10% weight)
    if (preferences.fuelTypes && preferences.fuelTypes.length > 0) {
      totalWeight += 10;
      score += (preferences.fuelTypes.includes(vehicle.fuelType) ? 10 : 0);
    }
    
    // Make match (10% weight)
    if (preferences.makes && preferences.makes.length > 0) {
      totalWeight += 10;
      score += (preferences.makes.includes(vehicle.make) ? 10 : 0);
    }
    
    // Year match (10% weight)
    if (preferences.years) {
      totalWeight += 10;
      score += this.calculateYearMatch(vehicle.year, preferences.years) * 10;
    }
    
    // Mileage match (10% weight)
    if (preferences.mileage) {
      totalWeight += 10;
      score += this.calculateMileageMatch(vehicle.mileage, preferences.mileage) * 10;
    }
    
    // Transmission match (5% weight)
    if (preferences.transmission) {
      totalWeight += 5;
      score += (vehicle.transmission === preferences.transmission ? 5 : 0);
    }
    
    // Features match (10% weight)
    if (preferences.features && preferences.features.length > 0) {
      totalWeight += 10;
      score += this.calculateFeaturesMatch(vehicle.features || [], preferences.features) * 10;
    }
    
    // Normalize score to 0-100 range
    return totalWeight > 0 ? (score / totalWeight) * 100 : 0;
  }
  
  /**
   * Calculate price match score
   */
  private static calculatePriceMatch(price: number, budget: { min: number; max: number }): number {
    if (price >= budget.min && price <= budget.max) {
      return 1; // Perfect match
    }
    
    // Calculate how far outside the budget the price is
    const range = budget.max - budget.min;
    const distance = Math.min(
      Math.abs(price - budget.min),
      Math.abs(price - budget.max)
    );
    
    // Return a score that decreases as distance increases
    return Math.max(0, 1 - (distance / range));
  }
  
  /**
   * Calculate year match score
   */
  private static calculateYearMatch(year: number, years: { min: number; max: number }): number {
    if (year >= years.min && year <= years.max) {
      return 1; // Perfect match
    }
    
    // Calculate how far outside the range the year is
    const range = years.max - years.min;
    const distance = Math.min(
      Math.abs(year - years.min),
      Math.abs(year - years.max)
    );
    
    // Return a score that decreases as distance increases
    return Math.max(0, 1 - (distance / range));
  }
  
  /**
   * Calculate mileage match score
   */
  private static calculateMileageMatch(mileage: number, mileageRange: { min: number; max: number }): number {
    if (mileage >= mileageRange.min && mileage <= mileageRange.max) {
      return 1; // Perfect match
    }
    
    // Calculate how far outside the range the mileage is
    const range = mileageRange.max - mileageRange.min;
    const distance = Math.min(
      Math.abs(mileage - mileageRange.min),
      Math.abs(mileage - mileageRange.max)
    );
    
    // Return a score that decreases as distance increases
    return Math.max(0, 1 - (distance / range));
  }
  
  /**
   * Calculate features match score
   */
  private static calculateFeaturesMatch(vehicleFeatures: string[], userFeatures: string[]): number {
    if (vehicleFeatures.length === 0) return 0;
    
    const matchingFeatures = vehicleFeatures.filter(f => userFeatures.includes(f));
    return matchingFeatures.length / userFeatures.length;
  }
  
  /**
   * Get personalized recommendations based on user behavior
   * This is a simplified version - in a real system, this would analyze user interactions
   */
  static async getPersonalizedRecommendations(userId: number, limit: number = 10): Promise<Vehicle[]> {
    // In a real implementation, we would:
    // 1. Analyze user's browsing history
    // 2. Analyze user's saved vehicles
    // 3. Analyze user's search history
    // 4. Analyze user's demographics/preferences
    
    // For now, we'll return featured vehicles as a placeholder
    const featuredVehicles = await storage.getFeaturedVehicles();
    return featuredVehicles.slice(0, limit);
  }
}
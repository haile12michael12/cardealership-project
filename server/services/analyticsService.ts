import { storage } from "../storage";
import { Vehicle, FinancingApplication, TestDrive, TradeIn } from "../schema";

export interface AnalyticsData {
  // Vehicle analytics
  totalVehicles: number;
  availableVehicles: number;
  soldVehicles: number;
  reservedVehicles: number;
  
  // Sales analytics
  totalSales: number;
  monthlySales: MonthlySales[];
  topSellingModels: TopSellingModel[];
  
  // Inventory analytics
  inventoryByMake: InventoryByMake[];
  inventoryByType: InventoryByType[];
  inventoryAgeDistribution: InventoryAgeDistribution[];
  
  // Customer analytics
  totalCustomers: number;
  newCustomers: number;
  customerEngagement: CustomerEngagement;
  
  // Financing analytics
  totalFinancingApps: number;
  approvedFinancingApps: number;
  financingApprovalRate: number;
  
  // Test drive analytics
  totalTestDrives: number;
  scheduledTestDrives: number;
  completedTestDrives: number;
  
  // Trade-in analytics
  totalTradeIns: number;
  averageTradeInValue: number;
  
  // Revenue analytics
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenue[];
  
  // Trends
  popularFeatures: PopularFeature[];
  seasonalTrends: SeasonalTrend[];
}

interface MonthlySales {
  month: string;
  year: number;
  sales: number;
  revenue: number;
}

interface TopSellingModel {
  make: string;
  model: string;
  sales: number;
  revenue: number;
}

interface InventoryByMake {
  make: string;
  count: number;
  percentage: number;
}

interface InventoryByType {
  type: string;
  count: number;
  percentage: number;
}

interface InventoryAgeDistribution {
  ageRange: string;
  count: number;
  percentage: number;
}

interface CustomerEngagement {
  totalInteractions: number;
  avgInteractionsPerCustomer: number;
  mostActiveCustomers: number;
}

interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
}

interface PopularFeature {
  feature: string;
  count: number;
}

interface SeasonalTrend {
  season: string;
  sales: number;
  trend: "increasing" | "decreasing" | "stable";
}

export class AnalyticsService {
  /**
   * Get comprehensive analytics data
   * @returns Analytics data
   */
  static async getAnalyticsData(): Promise<AnalyticsData> {
    // Get all data from storage
    const vehicles = await storage.getVehicles();
    const financingApps = await storage.getFinancingApplications();
    const testDrives = await storage.getTestDrives();
    const tradeIns = await storage.getTradeIns();
    const users = await storage.getUsers();
    
    // Calculate vehicle analytics
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(v => v.status === "available").length;
    const soldVehicles = vehicles.filter(v => v.status === "sold").length;
    const reservedVehicles = vehicles.filter(v => v.status === "reserved").length;
    
    // Calculate sales analytics
    const { totalSales, monthlySales, topSellingModels } = this.calculateSalesAnalytics(vehicles);
    
    // Calculate inventory analytics
    const inventoryByMake = this.calculateInventoryByMake(vehicles);
    const inventoryByType = this.calculateInventoryByType(vehicles);
    const inventoryAgeDistribution = this.calculateInventoryAgeDistribution(vehicles);
    
    // Calculate customer analytics
    const totalCustomers = users.length;
    const newCustomers = this.calculateNewCustomers(users);
    const customerEngagement = this.calculateCustomerEngagement(users, testDrives, financingApps);
    
    // Calculate financing analytics
    const totalFinancingApps = financingApps.length;
    const approvedFinancingApps = financingApps.filter(app => app.status === "approved").length;
    const financingApprovalRate = totalFinancingApps > 0 ? (approvedFinancingApps / totalFinancingApps) * 100 : 0;
    
    // Calculate test drive analytics
    const totalTestDrives = testDrives.length;
    const scheduledTestDrives = testDrives.filter(td => td.status === "scheduled").length;
    const completedTestDrives = testDrives.filter(td => td.status === "completed").length;
    
    // Calculate trade-in analytics
    const totalTradeIns = tradeIns.length;
    const averageTradeInValue = totalTradeIns > 0 
      ? tradeIns.reduce((sum, tradeIn) => sum + (tradeIn.estimatedValue || 0), 0) / totalTradeIns 
      : 0;
    
    // Calculate revenue analytics
    const totalRevenue = vehicles
      .filter(v => v.status === "sold")
      .reduce((sum, vehicle) => sum + vehicle.price, 0);
      
    const monthlyRevenue = this.calculateMonthlyRevenue(vehicles);
    
    // Calculate trends
    const popularFeatures = this.calculatePopularFeatures(vehicles);
    const seasonalTrends = this.calculateSeasonalTrends(vehicles);
    
    return {
      totalVehicles,
      availableVehicles,
      soldVehicles,
      reservedVehicles,
      totalSales,
      monthlySales,
      topSellingModels,
      inventoryByMake,
      inventoryByType,
      inventoryAgeDistribution,
      totalCustomers,
      newCustomers,
      customerEngagement,
      totalFinancingApps,
      approvedFinancingApps,
      financingApprovalRate,
      totalTestDrives,
      scheduledTestDrives,
      completedTestDrives,
      totalTradeIns,
      averageTradeInValue,
      totalRevenue,
      monthlyRevenue,
      popularFeatures,
      seasonalTrends
    };
  }
  
  /**
   * Calculate sales analytics
   */
  private static calculateSalesAnalytics(vehicles: Vehicle[]): { 
    totalSales: number; 
    monthlySales: MonthlySales[]; 
    topSellingModels: TopSellingModel[] 
  } {
    const soldVehicles = vehicles.filter(v => v.status === "sold");
    const totalSales = soldVehicles.length;
    
    // Group by month/year
    const monthlySalesMap: Record<string, { sales: number; revenue: number }> = {};
    
    soldVehicles.forEach(vehicle => {
      if (vehicle.soldAt) {
        const date = new Date(vehicle.soldAt);
        const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlySalesMap[monthYear]) {
          monthlySalesMap[monthYear] = { sales: 0, revenue: 0 };
        }
        
        monthlySalesMap[monthYear].sales += 1;
        monthlySalesMap[monthYear].revenue += vehicle.price;
      }
    });
    
    const monthlySales: MonthlySales[] = Object.entries(monthlySalesMap).map(([key, data]) => {
      const [month, year] = key.split('-');
      return {
        month: new Date(0, parseInt(month)).toLocaleString('default', { month: 'short' }),
        year: parseInt(year),
        sales: data.sales,
        revenue: data.revenue
      };
    });
    
    // Calculate top selling models
    const modelSalesMap: Record<string, { sales: number; revenue: number }> = {};
    
    soldVehicles.forEach(vehicle => {
      const key = `${vehicle.make}-${vehicle.model}`;
      if (!modelSalesMap[key]) {
        modelSalesMap[key] = { sales: 0, revenue: 0 };
      }
      modelSalesMap[key].sales += 1;
      modelSalesMap[key].revenue += vehicle.price;
    });
    
    const topSellingModels: TopSellingModel[] = Object.entries(modelSalesMap)
      .map(([key, data]) => {
        const [make, model] = key.split('-');
        return { make, model, sales: data.sales, revenue: data.revenue };
      })
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10);
    
    return { totalSales, monthlySales, topSellingModels };
  }
  
  /**
   * Calculate inventory by make
   */
  private static calculateInventoryByMake(vehicles: Vehicle[]): InventoryByMake[] {
    const makeCountMap: Record<string, number> = {};
    
    vehicles.forEach(vehicle => {
      if (!makeCountMap[vehicle.make]) {
        makeCountMap[vehicle.make] = 0;
      }
      makeCountMap[vehicle.make] += 1;
    });
    
    const total = vehicles.length;
    const inventoryByMake: InventoryByMake[] = Object.entries(makeCountMap).map(([make, count]) => ({
      make,
      count,
      percentage: (count / total) * 100
    }));
    
    return inventoryByMake.sort((a, b) => b.count - a.count);
  }
  
  /**
   * Calculate inventory by type
   */
  private static calculateInventoryByType(vehicles: Vehicle[]): InventoryByType[] {
    const typeCountMap: Record<string, number> = {};
    
    vehicles.forEach(vehicle => {
      if (!typeCountMap[vehicle.bodyType]) {
        typeCountMap[vehicle.bodyType] = 0;
      }
      typeCountMap[vehicle.bodyType] += 1;
    });
    
    const total = vehicles.length;
    const inventoryByType: InventoryByType[] = Object.entries(typeCountMap).map(([type, count]) => ({
      type,
      count,
      percentage: (count / total) * 100
    }));
    
    return inventoryByType.sort((a, b) => b.count - a.count);
  }
  
  /**
   * Calculate inventory age distribution
   */
  private static calculateInventoryAgeDistribution(vehicles: Vehicle[]): InventoryAgeDistribution[] {
    const ageRanges: Record<string, number> = {
      "0-1 years": 0,
      "1-3 years": 0,
      "3-5 years": 0,
      "5-10 years": 0,
      "10+ years": 0
    };
    
    const currentYear = new Date().getFullYear();
    
    vehicles.forEach(vehicle => {
      const age = currentYear - vehicle.year;
      
      if (age <= 1) {
        ageRanges["0-1 years"] += 1;
      } else if (age <= 3) {
        ageRanges["1-3 years"] += 1;
      } else if (age <= 5) {
        ageRanges["3-5 years"] += 1;
      } else if (age <= 10) {
        ageRanges["5-10 years"] += 1;
      } else {
        ageRanges["10+ years"] += 1;
      }
    });
    
    const total = vehicles.length;
    const inventoryAgeDistribution: InventoryAgeDistribution[] = Object.entries(ageRanges).map(([ageRange, count]) => ({
      ageRange,
      count,
      percentage: (count / total) * 100
    }));
    
    return inventoryAgeDistribution;
  }
  
  /**
   * Calculate new customers
   */
  private static calculateNewCustomers(users: any[]): number {
    // In a real implementation, this would check user creation dates
    // For demo, we'll return a mock value
    return Math.floor(users.length * 0.15); // 15% of users are new
  }
  
  /**
   * Calculate customer engagement
   */
  private static calculateCustomerEngagement(
    users: any[], 
    testDrives: TestDrive[], 
    financingApps: FinancingApplication[]
  ): CustomerEngagement {
    // In a real implementation, this would analyze actual user interactions
    // For demo, we'll return mock values
    const totalInteractions = testDrives.length + financingApps.length;
    const avgInteractionsPerCustomer = users.length > 0 ? totalInteractions / users.length : 0;
    const mostActiveCustomers = Math.floor(users.length * 0.2); // 20% of users are most active
    
    return {
      totalInteractions,
      avgInteractionsPerCustomer,
      mostActiveCustomers
    };
  }
  
  /**
   * Calculate monthly revenue
   */
  private static calculateMonthlyRevenue(vehicles: Vehicle[]): MonthlyRevenue[] {
    const soldVehicles = vehicles.filter(v => v.status === "sold" && v.soldAt);
    const revenueMap: Record<string, number> = {};
    
    soldVehicles.forEach(vehicle => {
      if (vehicle.soldAt) {
        const date = new Date(vehicle.soldAt);
        const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
        const monthName = date.toLocaleString('default', { month: 'short' });
        
        if (!revenueMap[monthYear]) {
          revenueMap[monthYear] = 0;
        }
        
        revenueMap[monthYear] += vehicle.price;
      }
    });
    
    const monthlyRevenue: MonthlyRevenue[] = Object.entries(revenueMap).map(([key, revenue]) => {
      const [month, year] = key.split('-');
      return {
        month: new Date(0, parseInt(month)).toLocaleString('default', { month: 'short' }),
        year: parseInt(year),
        revenue
      };
    });
    
    return monthlyRevenue;
  }
  
  /**
   * Calculate popular features
   */
  private static calculatePopularFeatures(vehicles: Vehicle[]): PopularFeature[] {
    const featureCountMap: Record<string, number> = {};
    
    vehicles.forEach(vehicle => {
      if (vehicle.features) {
        vehicle.features.forEach(feature => {
          if (!featureCountMap[feature]) {
            featureCountMap[feature] = 0;
          }
          featureCountMap[feature] += 1;
        });
      }
    });
    
    const popularFeatures: PopularFeature[] = Object.entries(featureCountMap)
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return popularFeatures;
  }
  
  /**
   * Calculate seasonal trends
   */
  private static calculateSeasonalTrends(vehicles: Vehicle[]): SeasonalTrend[] {
    // In a real implementation, this would analyze actual seasonal sales data
    // For demo, we'll return mock values
    return [
      { season: "Spring", sales: 120, trend: "increasing" },
      { season: "Summer", sales: 150, trend: "increasing" },
      { season: "Fall", sales: 110, trend: "decreasing" },
      { season: "Winter", sales: 90, trend: "decreasing" }
    ];
  }
  
  /**
   * Get real-time analytics data
   * @returns Real-time analytics data
   */
  static async getRealTimeAnalytics(): Promise<any> {
    // In a real implementation, this would provide real-time data updates
    // For demo, we'll return a subset of the full analytics
    const vehicles = await storage.getVehicles();
    const financingApps = await storage.getFinancingApplications();
    const testDrives = await storage.getTestDrives();
    
    return {
      activeUsers: Math.floor(Math.random() * 50) + 10, // Mock active users
      pendingFinancing: financingApps.filter(app => app.status === "pending").length,
      scheduledTestDrives: testDrives.filter(td => td.status === "scheduled").length,
      newVehicles: vehicles.filter(v => v.status === "available").length,
      recentSales: vehicles.filter(v => v.status === "sold" && v.soldAt && 
        new Date(v.soldAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length // Last 24 hours
    };
  }
}
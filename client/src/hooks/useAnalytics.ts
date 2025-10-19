import { useQuery } from "@tanstack/react-query";

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

interface RealTimeAnalytics {
  activeUsers: number;
  pendingFinancing: number;
  scheduledTestDrives: number;
  newVehicles: number;
  recentSales: number;
}

export const useAnalytics = () => {
  return useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics");
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      
      return response.json();
    },
  });
};

export const useRealTimeAnalytics = () => {
  return useQuery<RealTimeAnalytics>({
    queryKey: ["real-time-analytics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics/real-time");
      
      if (!response.ok) {
        throw new Error("Failed to fetch real-time analytics");
      }
      
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
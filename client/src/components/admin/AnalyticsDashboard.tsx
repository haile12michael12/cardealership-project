import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, 
  Car, 
  Users, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  Activity,
  Loader2
} from "lucide-react";
import { useAnalytics, useRealTimeAnalytics } from "@/hooks/useAnalytics";

const AnalyticsDashboard = () => {
  const { data: analytics, isLoading, error } = useAnalytics();
  const { data: realTimeData } = useRealTimeAnalytics();
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Failed to load analytics data</div>
        <div className="text-sm text-muted-foreground">{(error as Error).message}</div>
      </div>
    );
  }
  
  if (!analytics) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">No analytics data available</div>
      </div>
    );
  }
  
  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  
  // Transform data for charts
  const topSellingModelsData = analytics.topSellingModels.map(model => ({
    ...model,
    name: `${model.make} ${model.model}`
  }));
  
  return (
    <div className="space-y-6">
      {/* Real-time indicators */}
      {realTimeData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-500" />
                <div className="ml-3">
                  <div className="text-sm text-muted-foreground">Active Users</div>
                  <div className="text-xl font-bold">{realTimeData.activeUsers}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-green-500" />
                <div className="ml-3">
                  <div className="text-sm text-muted-foreground">Pending Financing</div>
                  <div className="text-xl font-bold">{realTimeData.pendingFinancing}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-purple-500" />
                <div className="ml-3">
                  <div className="text-sm text-muted-foreground">New Vehicles</div>
                  <div className="text-xl font-bold">{realTimeData.newVehicles}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-500" />
                <div className="ml-3">
                  <div className="text-sm text-muted-foreground">Scheduled Test Drives</div>
                  <div className="text-xl font-bold">{realTimeData.scheduledTestDrives}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-red-500" />
                <div className="ml-3">
                  <div className="text-sm text-muted-foreground">Recent Sales</div>
                  <div className="text-xl font-bold">{realTimeData.recentSales}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.availableVehicles} available, {analytics.soldVehicles} sold
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(analytics.totalRevenue)} total revenue
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.newCustomers} new this period
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financing Approval</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.financingApprovalRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.approvedFinancingApps}/{analytics.totalFinancingApps} approved
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales Trend</CardTitle>
            <CardDescription>Sales and revenue over time</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="sales"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="revenue"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${formatNumber(value)}`}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [formatCurrency(Number(value)), "Revenue"];
                    }
                    return [value, "Sales"];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="sales"
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  name="Sales"
                />
                <Line 
                  yAxisId="revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Inventory by Make */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Make</CardTitle>
            <CardDescription>Distribution of vehicles by manufacturer</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.inventoryByMake}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="make" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [value, "Vehicles"]}
                  labelFormatter={(value) => `Make: ${value}`}
                />
                <Bar dataKey="count" fill="#8884d8" name="Vehicles">
                  {analytics.inventoryByMake.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Top Selling Models */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Models</CardTitle>
            <CardDescription>Best performing vehicle models</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topSellingModelsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                  nameKey="name"
                  label={({ name, sales }) => `${name}: ${sales}`}
                >
                  {topSellingModelsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, "Sales"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Inventory Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Age Distribution</CardTitle>
            <CardDescription>Vehicle age ranges in inventory</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.inventoryAgeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="ageRange" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Percentage"]}
                  labelFormatter={(value) => `Age Range: ${value}`}
                />
                <Bar dataKey="percentage" fill="#82ca9d" name="Percentage">
                  {analytics.inventoryAgeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Drive Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Test Drives</span>
                <span className="font-medium">{analytics.totalTestDrives}</span>
              </div>
              <div className="flex justify-between">
                <span>Scheduled</span>
                <span className="font-medium">{analytics.scheduledTestDrives}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed</span>
                <span className="font-medium">{analytics.completedTestDrives}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Trade-In Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Trade-Ins</span>
                <span className="font-medium">{analytics.totalTradeIns}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. Value</span>
                <span className="font-medium">{formatCurrency(analytics.averageTradeInValue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Interactions</span>
                <span className="font-medium">{analytics.customerEngagement.totalInteractions}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg. per Customer</span>
                <span className="font-medium">{analytics.customerEngagement.avgInteractionsPerCustomer.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Most Active</span>
                <span className="font-medium">{analytics.customerEngagement.mostActiveCustomers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
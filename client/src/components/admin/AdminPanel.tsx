import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Vehicle, User, FinancingApplication, TestDrive, TradeIn } from "@/shared/schema";
import InventoryManager from "./InventoryManager";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car,
  Users,
  CreditCard,
  BarChart4,
  UserPlus,
  Calendar,
  FileSpreadsheet,
  Settings,
  Bell,
  TrendingUp,
} from "lucide-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  
  // Fetch data for summary statistics
  const { data: vehicles, isLoading: loadingVehicles } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });
  
  const { data: applications, isLoading: loadingApplications } = useQuery<FinancingApplication[]>({
    queryKey: ["/api/financing"],
  });
  
  const { data: testDrives, isLoading: loadingTestDrives } = useQuery<TestDrive[]>({
    queryKey: ["/api/test-drives"],
  });
  
  const isLoading = loadingVehicles || loadingApplications || loadingTestDrives;
  
  // Calculate summary statistics
  const statistics = {
    totalVehicles: vehicles?.length || 0,
    availableVehicles: vehicles?.filter(v => v.status === 'available').length || 0,
    pendingApplications: applications?.filter(a => a.status === 'pending').length || 0,
    upcomingTestDrives: testDrives?.filter(td => td.status === 'scheduled').length || 0,
    inventoryValue: vehicles?.reduce((total, vehicle) => total + vehicle.price, 0) || 0,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <Card className="lg:w-1/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="material-icons text-primary">admin_panel_settings</span>
              <span>Admin Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              <Button 
                variant={activeTab === "inventory" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("inventory")}
              >
                <Car className="mr-2 h-4 w-4" />
                Inventory
              </Button>
              <Button 
                variant={activeTab === "applications" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("applications")}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Finance Applications
              </Button>
              <Button 
                variant={activeTab === "testdrives" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("testdrives")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Test Drives
              </Button>
              <Button 
                variant={activeTab === "customers" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("customers")}
              >
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
              <Button 
                variant={activeTab === "analytics" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("analytics")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Button>
              <Button 
                variant={activeTab === "reports" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("reports")}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Reports
              </Button>
              <Button 
                variant={activeTab === "settings" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="lg:w-4/5 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Vehicles</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{statistics.totalVehicles}</p>
                    )}
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Applications</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{statistics.pendingApplications}</p>
                    )}
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Test Drives</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">{statistics.upcomingTestDrives}</p>
                    )}
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Inventory Value</p>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16 mt-1" />
                    ) : (
                      <p className="text-2xl font-bold">${statistics.inventoryValue.toLocaleString()}</p>
                    )}
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <BarChart4 className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full lg:w-2/3">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="testdrives">Test Drives</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="space-y-4">
              <InventoryManager />
            </TabsContent>
            
            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <CardTitle>Financing Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingApplications ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : applications && applications.length > 0 ? (
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {applications.map((app) => (
                            <tr key={app.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {app.firstName} {app.lastName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{app.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{app.creditScore}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  app.status === 'denied' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Button variant="outline" size="sm">View</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No financing applications found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="testdrives">
              <Card>
                <CardHeader>
                  <CardTitle>Test Drive Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingTestDrives ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : testDrives && testDrives.length > 0 ? (
                    <div className="rounded-md border">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {testDrives.map((drive) => {
                            const vehicle = vehicles?.find(v => v.id === drive.vehicleId);
                            return (
                              <tr key={drive.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {drive.firstName} {drive.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : `Vehicle #${drive.vehicleId}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {drive.date ? new Date(drive.date).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{drive.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    drive.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    drive.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                                  }`}>
                                    {drive.status.charAt(0).toUpperCase() + drive.status.slice(1)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <Button variant="outline" size="sm">View</Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-4 text-gray-500">No test drive appointments found.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Customer Management</span>
                    <Button className="bg-primary">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add Customer
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-gray-500">
                    Customer management functionality is currently under development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Analytics dashboard is available as a separate page
                    </p>
                    <Button asChild>
                      <a href="/admin/analytics">View Analytics Dashboard</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-gray-500">
                    Report generation functionality is currently under development.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-gray-500">
                    System settings and configurations will be managed here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

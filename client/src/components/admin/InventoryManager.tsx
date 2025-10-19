import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Vehicle, InsertVehicle, insertVehicleSchema } from "@/shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Car, Edit, PlusCircle, RefreshCw, Trash } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Extended vehicle schema with validation for form
const vehicleFormSchema = insertVehicleSchema.extend({
  price: z.string().min(1, "Price is required").transform(val => parseInt(val)),
  mileage: z.string().min(1, "Mileage is required").transform(val => parseInt(val)),
  year: z.string().min(1, "Year is required").transform(val => parseInt(val)),
  mpg: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  range: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  monthlyPayment: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  features: z.string().transform(val => val.split(',').map(item => item.trim())),
  images: z.string().transform(val => val.split(',').map(item => item.trim())),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

const InventoryManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  
  // Fetch vehicles
  const { data: vehicles, isLoading, refetch } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });
  
  // Form for adding/editing vehicles
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      exteriorColor: "",
      interiorColor: "",
      fuelType: "Gasoline",
      transmission: "Automatic",
      bodyType: "Sedan",
      vin: "",
      description: "",
      features: "",
      images: "",
      status: "available",
      isFeatured: false,
      mpg: "",
      range: "",
      monthlyPayment: "",
    }
  });
  
  // Set form values when editing
  const setFormForEditing = (vehicle: Vehicle) => {
    form.reset({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year.toString(),
      price: vehicle.price.toString(),
      mileage: vehicle.mileage.toString(),
      exteriorColor: vehicle.exteriorColor,
      interiorColor: vehicle.interiorColor || "",
      fuelType: vehicle.fuelType,
      transmission: vehicle.transmission,
      bodyType: vehicle.bodyType,
      vin: vehicle.vin,
      description: vehicle.description || "",
      features: vehicle.features?.join(", ") || "",
      images: vehicle.images?.join(", ") || "",
      status: vehicle.status,
      isFeatured: vehicle.isFeatured,
      mpg: vehicle.mpg?.toString() || "",
      range: vehicle.range?.toString() || "",
      monthlyPayment: vehicle.monthlyPayment?.toString() || "",
    });
    setEditingVehicle(vehicle);
    setIsAddDialogOpen(true);
  };
  
  const resetForm = () => {
    form.reset({
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      exteriorColor: "",
      interiorColor: "",
      fuelType: "Gasoline",
      transmission: "Automatic",
      bodyType: "Sedan",
      vin: "",
      description: "",
      features: "",
      images: "",
      status: "available",
      isFeatured: false,
      mpg: "",
      range: "",
      monthlyPayment: "",
    });
    setEditingVehicle(null);
  };
  
  // Create mutation
  const createVehicleMutation = useMutation({
    mutationFn: async (data: InsertVehicle) => {
      return apiRequest("POST", "/api/vehicles", data);
    },
    onSuccess: () => {
      toast({
        title: "Vehicle added successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to add vehicle",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update mutation
  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Vehicle> }) => {
      return apiRequest("PUT", `/api/vehicles/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Vehicle updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Failed to update vehicle",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/vehicles/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Vehicle deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete vehicle",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Submit handler
  const onSubmit = (data: VehicleFormValues) => {
    if (editingVehicle) {
      updateVehicleMutation.mutate({ id: editingVehicle.id, data });
    } else {
      createVehicleMutation.mutate(data as InsertVehicle);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vehicle Inventory</CardTitle>
            <CardDescription>
              Manage your vehicle inventory - add, edit, or remove vehicles
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "grid" | "table")}>
              <TabsList className="grid w-20 grid-cols-2">
                <TabsTrigger value="grid">
                  <span className="material-icons text-sm">grid_view</span>
                </TabsTrigger>
                <TabsTrigger value="table">
                  <span className="material-icons text-sm">view_list</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary" onClick={() => resetForm()}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingVehicle 
                      ? "Update the vehicle details below"
                      : "Fill out the form below to add a new vehicle to your inventory"}
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="make"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Make</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Toyota" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Camry" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 25000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mileage</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 15000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="monthlyPayment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Payment ($, optional)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 399" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="exteriorColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exterior Color</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Alpine White" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="interiorColor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interior Color</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Black" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="bodyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Body Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select body type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Sedan">Sedan</SelectItem>
                                <SelectItem value="SUV">SUV</SelectItem>
                                <SelectItem value="Truck">Truck</SelectItem>
                                <SelectItem value="Coupe">Coupe</SelectItem>
                                <SelectItem value="Convertible">Convertible</SelectItem>
                                <SelectItem value="Hatchback">Hatchback</SelectItem>
                                <SelectItem value="Wagon">Wagon</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fuelType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fuel Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select fuel type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Gasoline">Gasoline</SelectItem>
                                <SelectItem value="Diesel">Diesel</SelectItem>
                                <SelectItem value="Electric">Electric</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                                <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="transmission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transmission</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select transmission" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Automatic">Automatic</SelectItem>
                                <SelectItem value="Manual">Manual</SelectItem>
                                <SelectItem value="CVT">CVT</SelectItem>
                                <SelectItem value="Dual-Clutch">Dual-Clutch</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="vin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VIN</FormLabel>
                            <FormControl>
                              <Input placeholder="Vehicle Identification Number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="available">Available</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="reserved">Reserved</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="mpg"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>MPG (optional)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 32" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="range"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Range (miles, optional)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g. 300" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-3">
                            <div className="space-y-0.5">
                              <FormLabel>Featured Vehicle</FormLabel>
                              <FormDescription>
                                Show on homepage featured section
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter vehicle description" 
                              className="h-24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="features"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Features</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter features, separated by commas" 
                              className="h-24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter features separated by commas (e.g. Bluetooth, Leather Seats, Navigation)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="images"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Images</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter image URLs, separated by commas" 
                              className="h-24" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter image URLs separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-primary"
                        disabled={createVehicleMutation.isPending || updateVehicleMutation.isPending}
                      >
                        {createVehicleMutation.isPending || updateVehicleMutation.isPending ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin material-icons text-sm">sync</span>
                            {editingVehicle ? "Updating..." : "Adding..."}
                          </span>
                        ) : (
                          <span>{editingVehicle ? "Update Vehicle" : "Add Vehicle"}</span>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <Tabs value={viewMode} className="w-full">
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="overflow-hidden">
                      <div className="relative h-48">
                        <img 
                          src={vehicle.images && vehicle.images.length > 0 
                            ? vehicle.images[0] 
                            : "https://via.placeholder.com/800x600?text=No+Image+Available"}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Badge className={vehicle.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'}>
                            {vehicle.status}
                          </Badge>
                          {vehicle.isFeatured && (
                            <Badge className="bg-primary">Featured</Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold text-lg">${vehicle.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">{vehicle.mileage.toLocaleString()} mi</span>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 flex items-center justify-center"
                            onClick={() => setFormForEditing(vehicle)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm" className="flex items-center justify-center">
                                <Trash className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the
                                  {` ${vehicle.year} ${vehicle.make} ${vehicle.model} `}
                                  from your inventory.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-destructive"
                                  onClick={() => deleteVehicleMutation.mutate(vehicle.id)}
                                >
                                  {deleteVehicleMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="table" className="mt-0">
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {vehicles.map((vehicle) => (
                        <tr key={vehicle.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={vehicle.images && vehicle.images.length > 0 
                                    ? vehicle.images[0] 
                                    : "https://via.placeholder.com/100?text=No+Image"}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {vehicle.year} {vehicle.make} {vehicle.model}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {vehicle.bodyType} - {vehicle.exteriorColor}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">${vehicle.price.toLocaleString()}</div>
                            {vehicle.monthlyPayment && (
                              <div className="text-sm text-gray-500">${vehicle.monthlyPayment}/mo</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vehicle.mileage.toLocaleString()} mi
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={
                              vehicle.status === 'available' ? 'bg-green-500' : 
                              vehicle.status === 'sold' ? 'bg-red-500' : 
                              'bg-yellow-500'
                            }>
                              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {vehicle.isFeatured ? (
                              <span className="material-icons text-primary">star</span>
                            ) : (
                              <span className="material-icons text-gray-300">star_outline</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setFormForEditing(vehicle)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Trash className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the
                                      {` ${vehicle.year} ${vehicle.make} ${vehicle.model} `}
                                      from your inventory.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-destructive"
                                      onClick={() => deleteVehicleMutation.mutate(vehicle.id)}
                                    >
                                      {deleteVehicleMutation.isPending ? "Deleting..." : "Delete"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-gray-100 p-3 rounded-full mb-4">
                <Car className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No vehicles in inventory</h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Your inventory is currently empty. Click the "Add Vehicle" button to add your first vehicle.
              </p>
              <Button
                className="bg-primary"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First Vehicle
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default InventoryManager;

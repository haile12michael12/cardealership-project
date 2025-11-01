import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Vehicle } from "@/shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TIME_SLOTS } from "@/lib/constants";
import { 
  Form, 
  FormControl, 
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarIcon, Car, CheckCircle2, Clock, MapPin, Bell, Share2, GitCompare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import VehicleComparison from "@/components/home/VehicleComparison";

// Calculate tomorrow's date as the minimum date for the date picker
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

// Extended test drive form schema
const extendedTestDriveFormSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  date: z.date({
    required_error: "Please select a date",
  }).min(tomorrow, "Date must be at least tomorrow"),
  time: z.string().min(1, "Please select a time"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(1, "Please select a location"),
  reminders: z.boolean().optional(),
  compareWith: z.string().optional()
});

type ExtendedTestDriveFormValues = z.infer<typeof extendedTestDriveFormSchema>;

interface TestDriveFormProps {
  vehicleId?: string;
}

const TestDriveForm = ({ vehicleId }: TestDriveFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>(vehicleId ? [vehicleId] : []);
  
  // Fetch vehicles for the dropdown
  const { data: vehicles } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });
  
  // Fetch specific vehicle data if vehicleId is provided
  const { data: selectedVehicle } = useQuery<Vehicle>({
    queryKey: vehicleId ? [`/api/vehicles/${vehicleId}`] : ['skip-query'],
    enabled: !!vehicleId,
  });

  const form = useForm<ExtendedTestDriveFormValues>({
    resolver: zodResolver(extendedTestDriveFormSchema),
    defaultValues: {
      vehicleId: vehicleId || "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      time: "",
      location: "Main Dealership - 123 Auto Drive",
      reminders: false,
      compareWith: ""
    }
  });

  // Update vehicleId in form when prop changes
  useEffect(() => {
    if (vehicleId) {
      form.setValue("vehicleId", vehicleId);
      setSelectedVehicles([vehicleId]);
    }
  }, [vehicleId, form]);

  const testDriveMutation = useMutation({
    mutationFn: (data: ExtendedTestDriveFormValues) => {
      // Convert date to ISO string and vehicleId to number
      const formData = {
        ...data,
        date: data.date.toISOString(),
        vehicleId: parseInt(data.vehicleId)
      };
      return apiRequest("POST", "/api/test-drives", formData);
    },
    onSuccess: () => {
      toast({
        title: "Test Drive Scheduled",
        description: "Your test drive has been scheduled successfully. We'll see you soon!",
        variant: "default",
      });
      setIsSubmitted(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "There was a problem scheduling your test drive.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: ExtendedTestDriveFormValues) => {
    setIsSubmitting(true);
    testDriveMutation.mutate(data);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Test Drive Appointment',
        text: `I've scheduled a test drive for a ${form.getValues("vehicleId") ? vehicles?.find(v => v.id.toString() === form.getValues("vehicleId"))?.make + " " + vehicles?.find(v => v.id.toString() === form.getValues("vehicleId"))?.model : "vehicle"} on ${form.getValues("date") ? format(form.getValues("date"), "PPP") : ""} at ${form.getValues("time")}.`,
      }).catch(console.error);
    } else {
      toast({
        title: "Share",
        description: "Copy this link to share your appointment details",
      });
    }
  };

  const handleVehicleSelect = (vehicleId: string) => {
    if (selectedVehicles.length < 2) {
      setSelectedVehicles([...selectedVehicles, vehicleId]);
      if (selectedVehicles.length === 0) {
        form.setValue("vehicleId", vehicleId);
      }
    }
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    setSelectedVehicles(selectedVehicles.filter(id => id !== vehicleId));
    if (form.getValues("vehicleId") === vehicleId) {
      form.setValue("vehicleId", "");
    }
    if (form.getValues("compareWith") === vehicleId) {
      form.setValue("compareWith", "");
    }
  };

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="pt-6 px-6 pb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="mb-2 text-2xl">Test Drive Scheduled!</CardTitle>
          <CardDescription className="text-base mb-6">
            Your test drive has been scheduled successfully. We've sent a confirmation to your email with all the details.
          </CardDescription>
          <div className="p-4 bg-blue-50 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-blue-800 mb-2">Details:</h3>
            <p className="text-blue-700">
              {selectedVehicle && (
                <strong>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</strong>
              )}
              <br />
              Date: {form.getValues("date") ? format(form.getValues("date"), "EEEE, MMMM do, yyyy") : ""}
              <br />
              Time: {form.getValues("time")}
              <br />
              Location: {form.getValues("location")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button 
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark"
              onClick={() => window.location.href = "/inventory"}
            >
              Browse More Vehicles
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Appointment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Test Drive</CardTitle>
        <CardDescription>
          Experience your dream car firsthand. Select a vehicle, date, and time that works for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles?.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Compare vehicle option */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="compare-mode" 
                checked={compareMode}
                onCheckedChange={(checked) => setCompareMode(checked as boolean)}
              />
              <Label htmlFor="compare-mode" className="flex items-center cursor-pointer">
                <GitCompare className="h-4 w-4 mr-2" />
                Compare with another vehicle
              </Label>
            </div>
            
            {compareMode && (
              <FormField
                control={form.control}
                name="compareWith"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compare With</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle to compare" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles?.filter(v => v.id.toString() !== form.watch("vehicleId")).map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            // Can't select today or past dates
                            return date < tomorrow;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Main Dealership - 123 Auto Drive">
                        Main Dealership - 123 Auto Drive
                      </SelectItem>
                      <SelectItem value="North Branch - 456 Car Lane">
                        North Branch - 456 Car Lane
                      </SelectItem>
                      <SelectItem value="Westside Location - 789 Motor Way">
                        Westside Location - 789 Motor Way
                      </SelectItem>
                      <SelectItem value="Downtown Showroom - 321 Vehicle St">
                        Downtown Showroom - 321 Vehicle St
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-primary" />
                <Label htmlFor="reminders">Send me reminders</Label>
              </div>
              <FormField
                control={form.control}
                name="reminders"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Scheduling...</>
                ) : (
                  <>
                    <Car className="mr-2 h-4 w-4" />
                    Schedule Test Drive
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
        
        {/* Vehicle Comparison Section */}
        {vehicles && (
          <VehicleComparison
            vehicles={vehicles}
            selectedVehicles={selectedVehicles}
            onVehicleSelect={handleVehicleSelect}
            onRemoveVehicle={handleRemoveVehicle}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TestDriveForm;
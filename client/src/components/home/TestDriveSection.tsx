import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TEST_DRIVE_BENEFITS, TIME_SLOTS } from "@/lib/constants";
import { Vehicle } from "@/shared/schema";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { CalendarIcon, Car, Clock, MapPin, Bell, Share2, GitCompare, CheckCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import TestDriveAvailability from "@/components/home/TestDriveAvailability";

// Test drive form schema
const testDriveFormSchema = z.object({
  vehicleId: z.string().min(1, "Please select a vehicle"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(1, "Please select a location"),
  reminders: z.boolean().optional(),
  compareWith: z.string().optional()
});

type TestDriveFormValues = z.infer<typeof testDriveFormSchema>;

const TestDriveSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  
  // Fetch vehicles for the dropdown
  const { data: vehicles } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const form = useForm<TestDriveFormValues>({
    resolver: zodResolver(testDriveFormSchema),
    defaultValues: {
      vehicleId: "",
      date: undefined,
      time: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "Main Dealership - 123 Auto Drive",
      reminders: false,
      compareWith: ""
    }
  });

  // Calculate tomorrow's date as the minimum date for the date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const testDriveMutation = useMutation({
    mutationFn: (data: TestDriveFormValues) => {
      // Convert date to ISO string and vehicleId to number
      const formData = {
        ...data,
        date: data.date?.toISOString(),
        vehicleId: parseInt(data.vehicleId)
      };
      return apiRequest("POST", "/api/test-drives", formData);
    },
    onSuccess: () => {
      toast({
        title: "Test Drive Scheduled",
        description: "Your test drive has been scheduled successfully.",
        variant: "default"
      });
      setIsSubmitted(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "There was a problem scheduling your test drive.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: TestDriveFormValues) => {
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

  if (isSubmitted) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-green-100 p-3 rounded-full">
                <Car className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Test Drive Scheduled!</h2>
            <p className="text-gray-600 mb-6">
              Your test drive has been scheduled successfully. We've sent a confirmation to your email with all the details.
            </p>
            <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-medium text-blue-800 mb-3">Appointment Details:</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Car className="h-4 w-4 mr-2 text-blue-600" />
                  <span>
                    {form.getValues("vehicleId") && vehicles?.find(v => v.id.toString() === form.getValues("vehicleId")) && (
                      `${vehicles.find(v => v.id.toString() === form.getValues("vehicleId"))?.year} ${vehicles.find(v => v.id.toString() === form.getValues("vehicleId"))?.make} ${vehicles.find(v => v.id.toString() === form.getValues("vehicleId"))?.model}`
                    )}
                  </span>
                </p>
                <p className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{form.getValues("date") ? format(form.getValues("date"), "EEEE, MMMM do, yyyy") : ""}</span>
                </p>
                <p className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{form.getValues("time")}</span>
                </p>
                <p className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{form.getValues("location")}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-primary hover:bg-primary-dark"
                onClick={() => window.location.href = "/inventory"}
              >
                Browse More Vehicles
              </Button>
              <Button 
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Appointment
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Schedule a Test Drive</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Vehicle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border border-gray-300">
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
                            <SelectTrigger className="border border-gray-300">
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
                            <SelectTrigger className="border border-gray-300">
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
                          <SelectTrigger className="border border-gray-300">
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
                          <Input 
                            placeholder="Your first name" 
                            {...field} 
                            className="border border-gray-300"
                          />
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
                          <Input 
                            placeholder="Your last name" 
                            {...field} 
                            className="border border-gray-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Your email address" 
                          {...field} 
                          className="border border-gray-300"
                        />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Your phone number" 
                          {...field} 
                          className="border border-gray-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-md transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Scheduling..." : "Schedule Now"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowAvailability(!showAvailability)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {showAvailability ? "Hide" : "Show"} Real-time Availability
              </Button>
              
              {showAvailability && form.watch("vehicleId") && (
                <div className="mt-4">
                  <TestDriveAvailability 
                    vehicleId={form.watch("vehicleId")} 
                    location={form.watch("location")} 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1583267746897-2cf415887172?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=800" 
              alt="Person test driving a car" 
              className="rounded-lg shadow-lg w-full"
            />
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3">Experience Your Dream Car</h3>
              <p className="text-gray-600 mb-4">
                Nothing compares to getting behind the wheel. Schedule a test drive to experience the performance, comfort, and features firsthand.
              </p>
              <ul className="space-y-2">
                {TEST_DRIVE_BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-primary mr-2">{index === 0 ? "event_available" : index === 1 ? "route" : "person"}</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Advanced Features</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li className="flex items-center">
                    <GitCompare className="h-4 w-4 mr-2" />
                    Compare two vehicles side-by-side
                  </li>
                  <li className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Multiple convenient locations
                  </li>
                  <li className="flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Automatic reminders before your appointment
                  </li>
                  <li className="flex items-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share your appointment with friends/family
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Real-time availability checking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestDriveSection;
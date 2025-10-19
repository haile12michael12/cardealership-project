import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Vehicle } from "@/shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CREDIT_SCORE_RANGES } from "@/lib/constants";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
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
import { AlertCircle, CheckCircle2, CreditCard, DollarSign } from "lucide-react";

// Financing form schema
const financingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  creditScore: z.string().min(1, "Please select your credit score range"),
  employmentStatus: z.string().min(1, "Employment status is required"),
  annualIncome: z.string()
    .min(1, "Annual income is required")
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val >= 0, "Income must be a positive number"),
  vehicleId: z.string().optional(),
});

type FinancingFormValues = z.infer<typeof financingFormSchema>;

interface FinancingFormProps {
  vehicleId?: string;
}

const FinancingForm = ({ vehicleId }: FinancingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Fetch vehicle data if vehicleId is provided
  const { data: vehicle } = useQuery<Vehicle>({
    queryKey: vehicleId ? [`/api/vehicles/${vehicleId}`] : ['skip-query'],
    enabled: !!vehicleId,
  });

  const form = useForm<FinancingFormValues>({
    resolver: zodResolver(financingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      creditScore: "",
      employmentStatus: "",
      annualIncome: "",
      vehicleId: vehicleId || "",
    }
  });

  // Update vehicleId in form when prop changes
  useEffect(() => {
    if (vehicleId) {
      form.setValue("vehicleId", vehicleId);
    }
  }, [vehicleId, form]);

  const financingMutation = useMutation({
    mutationFn: async (data: FinancingFormValues) => {
      // Convert vehicleId from string to number if present
      const formData = {
        ...data,
        vehicleId: data.vehicleId ? parseInt(data.vehicleId) : undefined,
      };
      return apiRequest("POST", "/api/financing", formData);
    },
    onSuccess: () => {
      toast({
        title: "Financing Application Submitted",
        description: "Your application has been received. We'll contact you soon with more details.",
        variant: "default",
      });
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was a problem submitting your application.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: FinancingFormValues) => {
    setIsSubmitting(true);
    financingMutation.mutate(data);
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
          <CardTitle className="mb-2 text-2xl">Application Submitted</CardTitle>
          <CardDescription className="text-base mb-6">
            Thank you for submitting your financing application. Our team will review your information and contact you shortly.
          </CardDescription>
          <div className="p-4 bg-blue-50 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-blue-800 mb-2 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              What happens next?
            </h3>
            <ul className="text-blue-700 space-y-1 ml-7 list-disc">
              <li>Our financing team will review your application</li>
              <li>You'll receive an email confirmation shortly</li>
              <li>We'll contact you within 24-48 hours with your financing options</li>
              <li>You can then choose the best option for your needs</li>
            </ul>
          </div>
          <Button 
            className="w-full bg-primary hover:bg-primary-dark"
            onClick={() => window.location.href = "/inventory"}
          >
            Browse More Vehicles
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {vehicle ? (
            <span>Finance Application for {vehicle.year} {vehicle.make} {vehicle.model}</span>
          ) : (
            <span>Financing Application</span>
          )}
        </CardTitle>
        <CardDescription>
          Get pre-approved for financing in minutes. Fill out the form below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <FormField
              control={form.control}
              name="creditScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Credit Score</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select credit range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CREDIT_SCORE_RANGES.filter(option => option.value !== "Select credit range").map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="employmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                      <SelectItem value="Unemployed">Unemployed</SelectItem>
                      <SelectItem value="Retired">Retired</SelectItem>
                      <SelectItem value="Student">Student</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="annualIncome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Annual Income</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input 
                        type="number" 
                        placeholder="Your annual income" 
                        className="pl-9" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Hidden vehicleId field */}
            <input type="hidden" {...form.register("vehicleId")} />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-4">
              <p>
                By submitting this application, you authorize AutoDrive to obtain your credit information. 
                This will not affect your credit score. See our{" "}
                <a href="#" className="text-primary hover:underline">privacy policy</a> for details.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FinancingForm;

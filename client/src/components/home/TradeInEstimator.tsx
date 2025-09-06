import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { VEHICLE_YEARS, VEHICLE_MAKES, VEHICLE_CONDITIONS, TRADE_IN_BENEFITS } from "@/lib/constants";
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

// Trade-in form schema
const tradeInFormSchema = z.object({
  year: z.string().min(1, "Please select a year"),
  make: z.string().min(1, "Please select a make"),
  model: z.string().min(1, "Please enter a model"),
  trim: z.string().optional(),
  mileage: z.string()
    .min(1, "Please enter the mileage")
    .transform(val => parseInt(val))
    .refine(val => !isNaN(val) && val >= 0, "Mileage must be a positive number"),
  condition: z.string().min(1, "Please select a condition")
});

type TradeInFormValues = z.infer<typeof tradeInFormSchema>;

const TradeInEstimator = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

  const form = useForm<TradeInFormValues>({
    resolver: zodResolver(tradeInFormSchema),
    defaultValues: {
      year: "",
      make: "",
      model: "",
      trim: "",
      mileage: "",
      condition: ""
    }
  });

  const tradeInMutation = useMutation({
    mutationFn: async (data: TradeInFormValues) => {
      return apiRequest("POST", "/api/trade-ins", data);
    },
    onSuccess: (response) => {
      response.json().then(data => {
        if (data.estimatedValue) {
          setEstimatedValue(data.estimatedValue);
          toast({
            title: "Trade-In Estimate",
            description: `Your estimated trade-in value is $${data.estimatedValue.toLocaleString()}.`,
            variant: "default"
          });
        }
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was a problem estimating your trade-in value.",
        variant: "destructive"
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const onSubmit = (data: TradeInFormValues) => {
    setIsSubmitting(true);
    tradeInMutation.mutate(data);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Value Your Trade-In</h2>
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold mb-4">Get an Instant Trade-In Estimate</h3>
            <p className="text-gray-600 mb-6">
              Find out how much your current vehicle is worth in just a few simple steps. Get a competitive offer backed by real market data.
            </p>
            
            {estimatedValue !== null ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="font-bold text-green-800 text-lg mb-2">Your Estimated Trade-In Value</h4>
                <p className="text-green-700 text-3xl font-bold">${estimatedValue.toLocaleString()}</p>
                <p className="text-green-600 mt-2">This estimate is based on the information provided and current market conditions.</p>
                <Button 
                  className="mt-4 bg-primary hover:bg-primary-dark text-white"
                  onClick={() => {
                    setEstimatedValue(null);
                    form.reset();
                  }}
                >
                  Calculate Another Trade-In
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border border-gray-300">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VEHICLE_YEARS.map((year) => (
                              <SelectItem key={year.value} value={year.value}>
                                {year.label}
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
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border border-gray-300">
                              <SelectValue placeholder="Select Make" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VEHICLE_MAKES.filter(make => make.value !== "Any Make").map((make) => (
                              <SelectItem key={make.value} value={make.value}>
                                {make.label}
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
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter model" 
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
                    name="trim"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trim (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter trim" 
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
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter vehicle mileage" 
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
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border border-gray-300">
                              <SelectValue placeholder="Select Condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {VEHICLE_CONDITIONS.filter(condition => condition.value !== "Select Condition").map((condition) => (
                              <SelectItem key={condition.value} value={condition.value}>
                                {condition.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-md transition"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Get Estimate"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
          
          <div className="p-6 bg-gray-50">
            <h4 className="font-semibold mb-2">Why Trade-In With Us?</h4>
            <ul className="space-y-2">
              {TRADE_IN_BENEFITS.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="material-icons text-primary mr-2">check_circle</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeInEstimator;

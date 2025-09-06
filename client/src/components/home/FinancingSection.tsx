import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FINANCING_BENEFITS, CREDIT_SCORE_RANGES } from "@/lib/constants";
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

// Financing form schema
const financingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  creditScore: z.string().min(1, "Please select your credit score range")
});

type FinancingFormValues = z.infer<typeof financingFormSchema>;

const FinancingSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FinancingFormValues>({
    resolver: zodResolver(financingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      creditScore: ""
    }
  });

  const financingMutation = useMutation({
    mutationFn: async (data: FinancingFormValues) => {
      return apiRequest("POST", "/api/financing", data);
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your financing application has been submitted successfully.",
        variant: "default"
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "There was a problem submitting your application.",
        variant: "destructive"
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

  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Flexible Financing Options</h2>
            <p className="mb-6">
              Find the perfect financing solution tailored to your needs. Apply online in minutes and get instant pre-approval.
            </p>
            <ul className="space-y-3 mb-8">
              {FINANCING_BENEFITS.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="material-icons mr-2">check_circle</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/financing">
              <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-semibold transition flex items-center">
                <span className="material-icons mr-2">calculate</span>
                Calculate Payment
              </button>
            </Link>
          </div>
          
          <div className="lg:w-1/2 bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-primary text-xl font-bold mb-4">Get Pre-Approved Today</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neutral-dark">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your first name" 
                            {...field} 
                            className="border border-gray-300 text-neutral-dark"
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
                        <FormLabel className="text-neutral-dark">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your last name" 
                            {...field} 
                            className="border border-gray-300 text-neutral-dark"
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
                      <FormLabel className="text-neutral-dark">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Your email address" 
                          {...field} 
                          className="border border-gray-300 text-neutral-dark"
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
                      <FormLabel className="text-neutral-dark">Phone</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder="Your phone number" 
                          {...field} 
                          className="border border-gray-300 text-neutral-dark"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="creditScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-dark">Estimated Credit Score</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border border-gray-300 text-neutral-dark">
                            <SelectValue placeholder="Select credit range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CREDIT_SCORE_RANGES.map((option) => (
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-md transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Apply Now"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancingSection;

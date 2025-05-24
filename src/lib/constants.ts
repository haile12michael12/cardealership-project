// Vehicle Makes
export const VEHICLE_MAKES = [
  { value: "Any Make", label: "Any Make" },
  { value: "BMW", label: "BMW" },
  { value: "Ford", label: "Ford" },
  { value: "Honda", label: "Honda" },
  { value: "Mercedes", label: "Mercedes" },
  { value: "Tesla", label: "Tesla" },
  { value: "Toyota", label: "Toyota" }
];

// Body Types
export const BODY_TYPES = [
  { value: "Any Type", label: "Any Type" },
  { value: "Sedan", label: "Sedan" },
  { value: "SUV", label: "SUV" },
  { value: "Truck", label: "Truck" },
  { value: "Coupe", label: "Coupe" },
  { value: "Convertible", label: "Convertible" }
];

// Price Ranges
export const PRICE_RANGES = [
  { value: "Any Price", label: "Any Price" },
  { value: "0-20000", label: "Under $20,000" },
  { value: "20000-30000", label: "$20,000 - $30,000" },
  { value: "30000-50000", label: "$30,000 - $50,000" },
  { value: "50000-80000", label: "$50,000 - $80,000" },
  { value: "80000-1000000", label: "$80,000+" }
];

// Test Drive Time Slots
export const TIME_SLOTS = [
  { value: "9:00 AM", label: "9:00 AM" },
  { value: "10:00 AM", label: "10:00 AM" },
  { value: "11:00 AM", label: "11:00 AM" },
  { value: "12:00 PM", label: "12:00 PM" },
  { value: "1:00 PM", label: "1:00 PM" },
  { value: "2:00 PM", label: "2:00 PM" },
  { value: "3:00 PM", label: "3:00 PM" },
  { value: "4:00 PM", label: "4:00 PM" },
  { value: "5:00 PM", label: "5:00 PM" }
];

// Credit Score Ranges
export const CREDIT_SCORE_RANGES = [
  { value: "Select credit range", label: "Select credit range" },
  { value: "Excellent (720+)", label: "Excellent (720+)" },
  { value: "Good (690-719)", label: "Good (690-719)" },
  { value: "Fair (630-689)", label: "Fair (630-689)" },
  { value: "Needs Work (Below 630)", label: "Needs Work (Below 630)" }
];

// Vehicle Years
export const VEHICLE_YEARS = Array.from({ length: 15 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

// Vehicle Condition
export const VEHICLE_CONDITIONS = [
  { value: "Select Condition", label: "Select Condition" },
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Fair", label: "Fair" },
  { value: "Poor", label: "Poor" }
];

// Testimonials
export const TESTIMONIALS = [
  {
    rating: 5.0,
    text: "The virtual showroom experience was fantastic! I was able to explore every detail of my new BMW from home, and the financing process was incredibly smooth.",
    name: "Michael Johnson",
    title: "BMW 3 Series Owner"
  },
  {
    rating: 4.5,
    text: "The team at AutoDrive made buying my first electric vehicle stress-free. The AI assistant helped me find the perfect model for my needs, and the test drive sealed the deal.",
    name: "Sarah Miller",
    title: "Tesla Model Y Owner"
  },
  {
    rating: 5.0,
    text: "I was amazed at how much I got for my trade-in. The online valuation was spot-on, and the financing options beat everything else I'd found. Couldn't be happier with my new RAV4!",
    name: "David Chen",
    title: "Toyota RAV4 Owner"
  }
];

// Service Highlights
export const SERVICE_HIGHLIGHTS = [
  {
    icon: "category",
    title: "Extensive Inventory",
    description: "Browse thousands of vehicles from various manufacturers, all in one place."
  },
  {
    icon: "account_balance",
    title: "Easy Financing",
    description: "Get pre-approved in minutes with competitive rates and flexible terms."
  },
  {
    icon: "health_and_safety",
    title: "Quality Guarantee",
    description: "Every vehicle undergoes a comprehensive inspection before listing."
  }
];

// Financing Benefits
export const FINANCING_BENEFITS = [
  "Competitive interest rates",
  "Flexible terms from 24-84 months",
  "Options for all credit situations",
  "Trade-in value calculator"
];

// Virtual Showroom Benefits
export const VIRTUAL_SHOWROOM_BENEFITS = [
  "Explore vehicles in stunning detail",
  "View interior and exterior from all angles",
  "Learn about features with interactive hotspots",
  "Chat with specialists in real-time"
];

// Test Drive Benefits
export const TEST_DRIVE_BENEFITS = [
  "Flexible scheduling 7 days a week",
  "Personalized routes to test all aspects",
  "Expert guidance from our specialists"
];

// Trade-In Benefits
export const TRADE_IN_BENEFITS = [
  "Competitive, market-based valuations",
  "Seamless process with minimal paperwork",
  "Apply trade-in value directly to your new purchase"
];

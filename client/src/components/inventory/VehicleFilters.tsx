import { useState, useEffect, FormEvent } from "react";
import { useLocation } from "wouter";
import { 
  VEHICLE_MAKES, 
  BODY_TYPES, 
  PRICE_RANGES,
  VEHICLE_YEARS
} from "@/lib/constants";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search, FilterX, ChevronDown, ChevronUp } from "lucide-react";

const VehicleFilters = () => {
  const [location, setLocation] = useLocation();
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(location.split("?")[1] || ""));
  
  // Filter states
  const [make, setMake] = useState<string>(searchParams.get("make") || "");
  const [model, setModel] = useState<string>(searchParams.get("model") || "");
  const [bodyType, setBodyType] = useState<string>(searchParams.get("bodyType") || "");
  const [transmission, setTransmission] = useState<string>(searchParams.get("transmission") || "");
  const [minPrice, setMinPrice] = useState<string>(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get("maxPrice") || "");
  const [minYear, setMinYear] = useState<string>(searchParams.get("minYear") || "");
  const [maxYear, setMaxYear] = useState<string>(searchParams.get("maxYear") || "");
  const [minMileage, setMinMileage] = useState<string>(searchParams.get("minMileage") || "");
  const [maxMileage, setMaxMileage] = useState<string>(searchParams.get("maxMileage") || "");
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  
  // Advanced filters visibility
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Parse URL parameters on location change
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    setSearchParams(params);
    
    // Set state from URL parameters
    setMake(params.get("make") || "");
    setModel(params.get("model") || "");
    setBodyType(params.get("bodyType") || "");
    setTransmission(params.get("transmission") || "");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
    setMinYear(params.get("minYear") || "");
    setMaxYear(params.get("maxYear") || "");
    setMinMileage(params.get("minMileage") || "");
    setMaxMileage(params.get("maxMileage") || "");
    
    // Parse fuel types from URL
    const fuelParam = params.get("fuelType");
    if (fuelParam) {
      setFuelTypes(fuelParam.split(","));
    } else {
      setFuelTypes([]);
    }
  }, [location]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (make) params.append("make", make);
    if (model) params.append("model", model);
    if (bodyType) params.append("bodyType", bodyType);
    if (transmission) params.append("transmission", transmission);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    if (minYear) params.append("minYear", minYear);
    if (maxYear) params.append("maxYear", maxYear);
    if (minMileage) params.append("minMileage", minMileage);
    if (maxMileage) params.append("maxMileage", maxMileage);
    
    // Append fuel types if selected
    if (fuelTypes.length > 0) {
      params.append("fuelType", fuelTypes.join(","));
    }
    
    setLocation(`/inventory?${params.toString()}`);
  };
  
  const handleClearFilters = () => {
    setMake("");
    setModel("");
    setBodyType("");
    setTransmission("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setMinMileage("");
    setMaxMileage("");
    setFuelTypes([]);
    setLocation("/inventory");
  };
  
  const handleFuelTypeChange = (fuelType: string) => {
    if (fuelTypes.includes(fuelType)) {
      setFuelTypes(fuelTypes.filter(type => type !== fuelType));
    } else {
      setFuelTypes([...fuelTypes, fuelType]);
    }
  };
  
  // Extract price range values
  const handlePriceRangeChange = (range: string) => {
    if (range === "Any Price") {
      setMinPrice("");
      setMaxPrice("");
      return;
    }
    
    const [min, max] = range.split("-");
    setMinPrice(min);
    setMaxPrice(max || "");
  };
  
  // Extract year range values
  const handleYearRangeChange = (range: string) => {
    if (range === "Any Year") {
      setMinYear("");
      setMaxYear("");
      return;
    }
    
    const [min, max] = range.split("-");
    setMinYear(min);
    setMaxYear(max || "");
  };
  
  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Filter Vehicles</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilters}
            className="h-8 text-xs"
          >
            <FilterX className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="make">Make</Label>
            <Select value={make} onValueChange={setMake}>
              <SelectTrigger id="make">
                <SelectValue placeholder="Any Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Make</SelectItem>
                {VEHICLE_MAKES.filter(item => item.value !== "Any Make").map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input 
              id="model" 
              placeholder="Any Model" 
              value={model} 
              onChange={(e) => setModel(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bodyType">Body Type</Label>
            <Select value={bodyType} onValueChange={setBodyType}>
              <SelectTrigger id="bodyType">
                <SelectValue placeholder="Any Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any Type</SelectItem>
                {BODY_TYPES.filter(item => item.value !== "Any Type").map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priceRange">Price Range</Label>
            <Select 
              value={minPrice && maxPrice ? `${minPrice}-${maxPrice}` : minPrice ? `${minPrice}-` : "Any Price"}
              onValueChange={handlePriceRangeChange}
            >
              <SelectTrigger id="priceRange">
                <SelectValue placeholder="Any Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Price">Any Price</SelectItem>
                {PRICE_RANGES.filter(item => item.value !== "Any Price").map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="yearRange">Year Range</Label>
            <Select 
              value={minYear && maxYear ? `${minYear}-${maxYear}` : minYear ? `${minYear}-` : "Any Year"}
              onValueChange={handleYearRangeChange}
            >
              <SelectTrigger id="yearRange">
                <SelectValue placeholder="Any Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Any Year">Any Year</SelectItem>
                {VEHICLE_YEARS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full justify-between p-0 h-auto py-2 text-left"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <span>Advanced Filters</span>
            {showAdvancedFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {showAdvancedFilters && (
            <div className="space-y-4 pt-2 border-t">
              <div className="space-y-2">
                <Label>Transmission</Label>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="automatic" 
                      checked={transmission === "Automatic"}
                      onCheckedChange={() => setTransmission(transmission === "Automatic" ? "" : "Automatic")}
                    />
                    <label htmlFor="automatic" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Automatic
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="manual" 
                      checked={transmission === "Manual"}
                      onCheckedChange={() => setTransmission(transmission === "Manual" ? "" : "Manual")}
                    />
                    <label htmlFor="manual" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Manual
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileageRange">Mileage Range</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={minMileage} 
                    onChange={(e) => setMinMileage(e.target.value)} 
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={maxMileage} 
                    onChange={(e) => setMaxMileage(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="gasoline" 
                      checked={fuelTypes.includes("Gasoline")}
                      onCheckedChange={() => handleFuelTypeChange("Gasoline")}
                    />
                    <label htmlFor="gasoline" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Gasoline
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="hybrid" 
                      checked={fuelTypes.includes("Hybrid")}
                      onCheckedChange={() => handleFuelTypeChange("Hybrid")}
                    />
                    <label htmlFor="hybrid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Hybrid
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="electric" 
                      checked={fuelTypes.includes("Electric")}
                      onCheckedChange={() => handleFuelTypeChange("Electric")}
                    />
                    <label htmlFor="electric" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Electric
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VehicleFilters;
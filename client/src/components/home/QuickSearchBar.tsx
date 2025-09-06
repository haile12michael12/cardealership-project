import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import { VEHICLE_MAKES, BODY_TYPES, PRICE_RANGES } from "@/lib/constants";

const QuickSearchBar = () => {
  const [, setLocation] = useLocation();
  const [make, setMake] = useState("Any Make");
  const [model, setModel] = useState("Any Model");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [bodyType, setBodyType] = useState("Any Type");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    
    if (make !== "Any Make") params.append("make", make);
    if (model !== "Any Model") params.append("model", model);
    if (bodyType !== "Any Type") params.append("bodyType", bodyType);
    
    if (priceRange !== "Any Price") {
      const [min, max] = priceRange.split("-");
      if (min) params.append("minPrice", min);
      if (max) params.append("maxPrice", max);
    }
    
    setLocation(`/inventory?${params.toString()}`);
  };

  return (
    <section className="bg-white py-6 shadow-md">
      <div className="container mx-auto px-4">
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Make</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={make}
              onChange={(e) => setMake(e.target.value)}
            >
              {VEHICLE_MAKES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            >
              <option>Any Model</option>
              {/* Models would be populated based on selected make */}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Price Range</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              {PRICE_RANGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Body Type</label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
            >
              {BODY_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default QuickSearchBar;

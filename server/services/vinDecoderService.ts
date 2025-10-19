// Mock VIN decoder service - in a real implementation, this would integrate with a third-party API
export class VinDecoderService {
  /**
   * Decode a VIN number to get vehicle specifications
   * @param vin Vehicle Identification Number
   * @returns Vehicle specifications
   */
  static async decodeVin(vin: string): Promise<any> {
    // In a real implementation, this would call an external API like:
    // - NHTSA API (free)
    // - AutoAPI VIN decoder
    // - Carfax API
    // - Edmunds API
    
    // For demo purposes, we'll return mock data based on the VIN
    // A real VIN has specific patterns that can be decoded
    
    // Validate VIN format (17 characters, alphanumeric except I, O, Q)
    if (!vin || vin.length !== 17) {
      throw new Error("Invalid VIN format");
    }
    
    // Mock implementation based on VIN patterns
    // In reality, each character in a VIN has specific meaning:
    // Positions 1-3: World Manufacturer Identifier (WMI)
    // Positions 4-8: Vehicle Descriptor Section (VDS)
    // Position 9: Check digit
    // Positions 10-17: Vehicle Identifier Section (VIS)
    
    const wmi = vin.substring(0, 3);
    const vds = vin.substring(3, 8);
    const vis = vin.substring(9, 17);
    
    // Extract year from position 10
    const yearChar = vin.charAt(9);
    const nextChar = vin.charAt(10);
    const year = this.decodeYear(yearChar, nextChar);
    
    // Extract manufacturer from WMI
    const manufacturer = this.decodeManufacturer(wmi);
    
    // Generate mock data based on VIN
    return {
      vin: vin,
      make: manufacturer.make,
      model: this.generateModel(vds, manufacturer.make),
      year: year,
      engine: this.generateEngine(vds),
      transmission: Math.random() > 0.5 ? "Automatic" : "Manual",
      bodyType: this.generateBodyType(vds),
      drivetrain: this.generateDrivetrain(vds),
      fuelType: this.generateFuelType(vds),
      doors: this.generateDoors(vds),
      cylinders: this.generateCylinders(vds),
      displacement: this.generateDisplacement(vds),
      manufacturedIn: manufacturer.country,
      plantCode: vis.substring(0, 1),
      sequenceNumber: vis.substring(1),
      // Additional specs that could be retrieved
      trim: this.generateTrim(vds),
      color: this.generateColor(),
      features: this.generateFeatures()
    };
  }
  
  /**
   * Decode manufacturer from WMI
   */
  private static decodeManufacturer(wmi: string): { make: string; country: string } {
    // This is a simplified mapping - real implementation would be more comprehensive
    const manufacturers: Record<string, { make: string; country: string }> = {
      "1HG": { make: "Honda", country: "Japan" },
      "2HG": { make: "Honda", country: "Canada" },
      "JH4": { make: "Acura", country: "Japan" },
      "WBA": { make: "BMW", country: "Germany" },
      "WVW": { make: "Volkswagen", country: "Germany" },
      "WAU": { make: "Audi", country: "Germany" },
      "WDD": { make: "Mercedes-Benz", country: "Germany" },
      "WP0": { make: "Porsche", country: "Germany" },
      "JT2": { make: "Toyota", country: "Japan" },
      "JT8": { make: "Lexus", country: "Japan" },
      "KMH": { make: "Hyundai", country: "South Korea" },
      "KNA": { make: "Kia", country: "South Korea" },
      "1F": { make: "Ford", country: "USA" },
      "1G": { make: "General Motors", country: "USA" },
      "2G": { make: "General Motors", country: "Canada" },
      "3G": { make: "General Motors", country: "Mexico" },
      "5YJ": { make: "Tesla", country: "USA" }
    };
    
    return manufacturers[wmi] || { make: "Unknown", country: "Unknown" };
  }
  
  /**
   * Decode year from VIN character
   */
  private static decodeYear(char: string, nextChar: string): number {
    // Simplified year decoding - real implementation would be more complex
    // Note: VIN year codes skip I, O, Q, U, Z and 0
    const yearMap: Record<string, number> = {
      // 1980s
      "A": 1980, "B": 1981, "C": 1982, "D": 1983, "E": 1984, "F": 1985, "G": 1986, "H": 1987, "J": 1988, "K": 1989,
      // 1990s
      "L": 1990, "M": 1991, "N": 1992, "P": 1993, "R": 1994, "S": 1995, "T": 1996, "V": 1997, "W": 1998, "X": 1999,
      // 2000s
      "Y": 2000, "1": 2001, "2": 2002, "3": 2003, "4": 2004, "5": 2005, "6": 2006, "7": 2007, "8": 2008, "9": 2009
    };
    
    // 2010-2039 (using the next character to differentiate)
    const yearMap2000s: Record<string, number> = {
      "A": 2010, "B": 2011, "C": 2012, "D": 2013, "E": 2014, "F": 2015, "G": 2016, "H": 2017, "J": 2018, "K": 2019,
      "L": 2020, "M": 2021, "N": 2022, "P": 2023, "R": 2024, "S": 2025, "T": 2026, "V": 2027, "W": 2028, "X": 2029,
      "Y": 2030, "1": 2031, "2": 2032, "3": 2033, "4": 2034, "5": 2035, "6": 2036, "7": 2037, "8": 2038, "9": 2039
    };
    
    // If next character is '2', it's likely 2010s-2030s
    if (nextChar === "2") {
      return yearMap2000s[char] || new Date().getFullYear();
    }
    
    return yearMap[char] || new Date().getFullYear();
  }
  
  /**
   * Generate model based on VDS
   */
  private static generateModel(vds: string, make: string): string {
    // This would be more sophisticated in a real implementation
    const models: Record<string, string[]> = {
      "Honda": ["Civic", "Accord", "CR-V", "Pilot", "Odyssey"],
      "BMW": ["3 Series", "5 Series", "X3", "X5", "i3"],
      "Toyota": ["Camry", "Corolla", "RAV4", "Highlander", "Prius"],
      "Ford": ["F-150", "Mustang", "Explorer", "Escape", "Focus"],
      "Mercedes-Benz": ["C-Class", "E-Class", "GLE", "GLC", "A-Class"],
      "Tesla": ["Model S", "Model 3", "Model X", "Model Y"],
      "Unknown": ["Sedan", "SUV", "Truck"]
    };
    
    const makeModels = models[make] || models["Unknown"];
    const index = vds.charCodeAt(0) % makeModels.length;
    return makeModels[index];
  }
  
  /**
   * Generate engine information
   */
  private static generateEngine(vds: string): string {
    const engines = [
      "2.0L Inline-4", "3.5L V6", "5.0L V8", "1.5L Turbo", "2.5L Hybrid", 
      "Electric Motor", "1.6L Diesel", "4.0L V8", "3.0L Turbo", "1.2L Inline-3"
    ];
    const index = vds.charCodeAt(1) % engines.length;
    return engines[index];
  }
  
  /**
   * Generate body type
   */
  private static generateBodyType(vds: string): string {
    const bodyTypes = ["Sedan", "SUV", "Coupe", "Convertible", "Hatchback", "Wagon", "Truck", "Van"];
    const index = vds.charCodeAt(2) % bodyTypes.length;
    return bodyTypes[index];
  }
  
  /**
   * Generate drivetrain
   */
  private static generateDrivetrain(vds: string): string {
    const drivetrains = ["FWD", "RWD", "AWD", "4WD"];
    const index = vds.charCodeAt(3) % drivetrains.length;
    return drivetrains[index];
  }
  
  /**
   * Generate fuel type
   */
  private static generateFuelType(vds: string): string {
    const fuelTypes = ["Gasoline", "Diesel", "Hybrid", "Electric", "Flex Fuel"];
    const index = vds.charCodeAt(4) % fuelTypes.length;
    return fuelTypes[index];
  }
  
  /**
   * Generate number of doors
   */
  private static generateDoors(vds: string): number {
    const doors = [2, 4];
    const index = vds.charCodeAt(0) % doors.length;
    return doors[index];
  }
  
  /**
   * Generate number of cylinders
   */
  private static generateCylinders(vds: string): number {
    const cylinders = [3, 4, 6, 8, 12];
    const index = vds.charCodeAt(1) % cylinders.length;
    return cylinders[index];
  }
  
  /**
   * Generate engine displacement
   */
  private static generateDisplacement(vds: string): string {
    const displacements = ["1.0L", "1.5L", "2.0L", "2.5L", "3.0L", "3.5L", "4.0L", "5.0L", "6.2L"];
    const index = vds.charCodeAt(2) % displacements.length;
    return displacements[index];
  }
  
  /**
   * Generate trim level
   */
  private static generateTrim(vds: string): string {
    const trims = ["Base", "Sport", "LX", "EX", "Touring", "Premium", "Limited", "Platinum", "Ultimate"];
    const index = vds.charCodeAt(3) % trims.length;
    return trims[index];
  }
  
  /**
   * Generate color
   */
  private static generateColor(): string {
    const colors = [
      "White", "Black", "Silver", "Gray", "Blue", "Red", "Green", "Brown", 
      "Beige", "Gold", "Orange", "Purple", "Yellow"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  /**
   * Generate features
   */
  private static generateFeatures(): string[] {
    const allFeatures = [
      "Navigation System", "Leather Seats", "Sunroof", "Heated Seats", 
      "Bluetooth", "Backup Camera", "Keyless Entry", "Cruise Control",
      "Lane Departure Warning", "Blind Spot Monitoring", "Apple CarPlay",
      "Android Auto", "Wireless Charging", "Premium Sound System"
    ];
    
    // Randomly select 3-7 features
    const count = Math.floor(Math.random() * 5) + 3;
    const selectedFeatures: string[] = [];
    
    while (selectedFeatures.length < count) {
      const feature = allFeatures[Math.floor(Math.random() * allFeatures.length)];
      if (!selectedFeatures.includes(feature)) {
        selectedFeatures.push(feature);
      }
    }
    
    return selectedFeatures;
  }
}
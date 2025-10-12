import { 
  users, 
  vehicles, 
  financingApplications, 
  testDrives, 
  tradeIns,
  type User, 
  type Vehicle, 
  type FinancingApplication, 
  type TestDrive, 
  type TradeIn,
  type InsertUser,
  type InsertVehicle,
  type InsertFinancingApplication,
  type InsertTestDrive,
  type InsertTradeIn
} from "../shared/schema";

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vehicle operations
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehicles(filters?: Partial<Vehicle>): Promise<Vehicle[]>;
  getFeaturedVehicles(): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Financing operations
  getFinancingApplication(id: number): Promise<FinancingApplication | undefined>;
  getFinancingApplications(): Promise<FinancingApplication[]>;
  createFinancingApplication(application: InsertFinancingApplication): Promise<FinancingApplication>;
  updateFinancingApplication(id: number, application: Partial<FinancingApplication>): Promise<FinancingApplication | undefined>;
  
  // Test drive operations
  getTestDrive(id: number): Promise<TestDrive | undefined>;
  getTestDrives(): Promise<TestDrive[]>;
  createTestDrive(testDrive: InsertTestDrive): Promise<TestDrive>;
  updateTestDrive(id: number, testDrive: Partial<TestDrive>): Promise<TestDrive | undefined>;
  
  // Trade-in operations
  getTradeIn(id: number): Promise<TradeIn | undefined>;
  getTradeIns(): Promise<TradeIn[]>;
  createTradeIn(tradeIn: InsertTradeIn): Promise<TradeIn>;
  updateTradeIn(id: number, tradeIn: Partial<TradeIn>): Promise<TradeIn | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vehicles: Map<number, Vehicle>;
  private financingApplications: Map<number, FinancingApplication>;
  private testDrives: Map<number, TestDrive>;
  private tradeIns: Map<number, TradeIn>;
  
  private userIdCounter: number;
  private vehicleIdCounter: number;
  private financingIdCounter: number;
  private testDriveIdCounter: number;
  private tradeInIdCounter: number;

  constructor() {
    this.users = new Map();
    this.vehicles = new Map();
    this.financingApplications = new Map();
    this.testDrives = new Map();
    this.tradeIns = new Map();
    
    this.userIdCounter = 1;
    this.vehicleIdCounter = 1;
    this.financingIdCounter = 1;
    this.testDriveIdCounter = 1;
    this.tradeInIdCounter = 1;
    
    // Initialize with some demo data
    this.initializeDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Vehicle operations
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getVehicles(filters?: Partial<Vehicle>): Promise<Vehicle[]> {
    let vehicles = Array.from(this.vehicles.values());
    
    if (filters) {
      vehicles = vehicles.filter(vehicle => {
        return Object.entries(filters).every(([key, value]) => {
          // @ts-ignore - Dynamic filter
          if (value === undefined) return true;
          
          // Special case for price range
          if (key === 'price' && typeof value === 'object') {
            const min = (value as any).min;
            const max = (value as any).max;
            if (min !== undefined && vehicle.price < min) return false;
            if (max !== undefined && vehicle.price > max) return false;
            return true;
          }
          
          // @ts-ignore - Dynamic filter
          return vehicle[key] === value;
        });
      });
    }
    
    return vehicles;
  }

  async getFeaturedVehicles(): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(
      (vehicle) => vehicle.isFeatured,
    );
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.vehicleIdCounter++;
    const vehicle: Vehicle = { ...insertVehicle, id };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: number, updateData: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    
    const updatedVehicle = { ...vehicle, ...updateData };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  // Financing operations
  async getFinancingApplication(id: number): Promise<FinancingApplication | undefined> {
    return this.financingApplications.get(id);
  }

  async getFinancingApplications(): Promise<FinancingApplication[]> {
    return Array.from(this.financingApplications.values());
  }

  async createFinancingApplication(insertApplication: InsertFinancingApplication): Promise<FinancingApplication> {
    const id = this.financingIdCounter++;
    const createdAt = new Date();
    const application: FinancingApplication = { ...insertApplication, id, createdAt };
    this.financingApplications.set(id, application);
    return application;
  }

  async updateFinancingApplication(id: number, updateData: Partial<FinancingApplication>): Promise<FinancingApplication | undefined> {
    const application = this.financingApplications.get(id);
    if (!application) return undefined;
    
    const updatedApplication = { ...application, ...updateData };
    this.financingApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  // Test drive operations
  async getTestDrive(id: number): Promise<TestDrive | undefined> {
    return this.testDrives.get(id);
  }

  async getTestDrives(): Promise<TestDrive[]> {
    return Array.from(this.testDrives.values());
  }

  async createTestDrive(insertTestDrive: InsertTestDrive): Promise<TestDrive> {
    const id = this.testDriveIdCounter++;
    const createdAt = new Date();
    const testDrive: TestDrive = { ...insertTestDrive, id, createdAt };
    this.testDrives.set(id, testDrive);
    return testDrive;
  }

  async updateTestDrive(id: number, updateData: Partial<TestDrive>): Promise<TestDrive | undefined> {
    const testDrive = this.testDrives.get(id);
    if (!testDrive) return undefined;
    
    const updatedTestDrive = { ...testDrive, ...updateData };
    this.testDrives.set(id, updatedTestDrive);
    return updatedTestDrive;
  }

  // Trade-in operations
  async getTradeIn(id: number): Promise<TradeIn | undefined> {
    return this.tradeIns.get(id);
  }

  async getTradeIns(): Promise<TradeIn[]> {
    return Array.from(this.tradeIns.values());
  }

  async createTradeIn(insertTradeIn: InsertTradeIn): Promise<TradeIn> {
    const id = this.tradeInIdCounter++;
    const createdAt = new Date();
    // Calculate estimated value (simple mock formula)
    const baseValue = 5000;
    const yearValue = (new Date().getFullYear() - insertTradeIn.year) * 500;
    const mileageValue = Math.floor(insertTradeIn.mileage / 10000) * 1000;
    let conditionMultiplier = 1.0;
    
    switch(insertTradeIn.condition) {
      case 'Excellent': conditionMultiplier = 1.3; break;
      case 'Good': conditionMultiplier = 1.0; break;
      case 'Fair': conditionMultiplier = 0.8; break;
      case 'Poor': conditionMultiplier = 0.6; break;
    }
    
    const estimatedValue = Math.max(500, Math.floor((baseValue - yearValue - mileageValue) * conditionMultiplier));
    
    const tradeIn: TradeIn = { 
      ...insertTradeIn, 
      id, 
      createdAt, 
      estimatedValue, 
    };
    
    this.tradeIns.set(id, tradeIn);
    return tradeIn;
  }

  async updateTradeIn(id: number, updateData: Partial<TradeIn>): Promise<TradeIn | undefined> {
    const tradeIn = this.tradeIns.get(id);
    if (!tradeIn) return undefined;
    
    const updatedTradeIn = { ...tradeIn, ...updateData };
    this.tradeIns.set(id, updatedTradeIn);
    return updatedTradeIn;
  }

  // Initialize demo data
  private initializeDemoData() {
    // Demo admin user
    this.createUser({
      username: "admin",
      password: "password",
      email: "admin@autodrive.com",
      firstName: "Admin",
      lastName: "User",
      phone: "555-123-4567",
      role: "admin"
    });
    
    // Demo regular user
    this.createUser({
      username: "user",
      password: "password",
      email: "user@example.com",
      firstName: "Regular",
      lastName: "User",
      phone: "555-987-6543",
      role: "customer"
    });
    
    // Demo vehicles
    const demoVehicles = [
      {
        make: "BMW",
        model: "3 Series",
        year: 2023,
        price: 42990,
        mileage: 12450,
        exteriorColor: "Alpine White",
        interiorColor: "Black",
        fuelType: "Gasoline",
        transmission: "Automatic",
        bodyType: "Sedan",
        vin: "WBADZ3C54DEM21912",
        description: "Luxury sedan with premium features and excellent handling.",
        features: ["Navigation", "Leather Seats", "Sunroof", "Heated Seats", "Bluetooth"],
        images: [
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        status: "available",
        isFeatured: true,
        mpg: 28,
        monthlyPayment: 599
      },
      {
        make: "Tesla",
        model: "Model Y",
        year: 2023,
        price: 58990,
        mileage: 5210,
        exteriorColor: "Red Multi-Coat",
        interiorColor: "White",
        fuelType: "Electric",
        transmission: "Automatic",
        bodyType: "SUV",
        vin: "5YJYGDEE1MF211890",
        description: "All-electric SUV with cutting-edge technology and performance.",
        features: ["Autopilot", "Premium Sound System", "All-Wheel Drive", "Glass Roof", "Supercharging"],
        images: [
          "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        status: "available",
        isFeatured: true,
        range: 330,
        monthlyPayment: 799
      },
      {
        make: "Mercedes-Benz",
        model: "C-Class",
        year: 2023,
        price: 49990,
        mileage: 3120,
        exteriorColor: "Obsidian Black",
        interiorColor: "Beige",
        fuelType: "Gasoline",
        transmission: "Automatic",
        bodyType: "Sedan",
        vin: "WDDWJ4KB2KF826712",
        description: "Elegant luxury sedan with advanced safety features and powerful performance.",
        features: ["MBUX Infotainment", "Driver Assistance Package", "Premium Audio", "LED Headlights", "Power Seats"],
        images: [
          "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        status: "available",
        isFeatured: true,
        mpg: 26,
        monthlyPayment: 699
      },
      {
        make: "Toyota",
        model: "RAV4",
        year: 2023,
        price: 34990,
        mileage: 7850,
        exteriorColor: "Silver Sky",
        interiorColor: "Black",
        fuelType: "Hybrid",
        transmission: "CVT",
        bodyType: "SUV",
        vin: "JTMW1RFV4MD061104",
        description: "Reliable and fuel-efficient hybrid SUV with Toyota Safety Sense.",
        features: ["Toyota Safety Sense", "Apple CarPlay", "Android Auto", "AWD", "Smart Key System"],
        images: [
          "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        status: "available",
        isFeatured: true,
        mpg: 40,
        monthlyPayment: 499
      },
      {
        make: "Ford",
        model: "Mustang",
        year: 2023,
        price: 38990,
        mileage: 1250,
        exteriorColor: "Race Red",
        interiorColor: "Ebony",
        fuelType: "Gasoline",
        transmission: "Manual",
        bodyType: "Coupe",
        vin: "1FA6P8TH1L5128810",
        description: "Iconic American muscle car with powerful performance and head-turning style.",
        features: ["V8 Engine", "SYNC 4", "Track Apps", "Performance Package", "Brembo Brakes"],
        images: [
          "https://images.unsplash.com/photo-1584345604476-8ec5f82d24c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        status: "available",
        isFeatured: false,
        mpg: 22,
        monthlyPayment: 549
      },
      {
        make: "Honda",
        model: "Accord",
        year: 2023,
        price: 32990,
        mileage: 9870,
        exteriorColor: "Crystal Black",
        interiorColor: "Gray",
        fuelType: "Gasoline",
        transmission: "Automatic",
        bodyType: "Sedan",
        vin: "1HGCV2F35NA001234",
        description: "Midsize sedan with excellent reliability, comfort, and fuel efficiency.",
        features: ["Honda Sensing Suite", "Wireless CarPlay", "Android Auto", "Dual-Zone Climate", "Heated Seats"],
        images: [
          "https://images.unsplash.com/photo-1629178275400-51697e9c5c76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        ],
        status: "available",
        isFeatured: false,
        mpg: 32,
        monthlyPayment: 459
      }
    ];
    
    for (const vehicle of demoVehicles) {
      this.createVehicle(vehicle);
    }
  }
}

export const storage = new MemStorage();

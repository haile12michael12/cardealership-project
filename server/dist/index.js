// index.ts
import express2 from "express";

// Routes/apiRoutes.ts
import { createServer } from "http";

// Models/storage.ts
var MemStorage = class {
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.vehicles = /* @__PURE__ */ new Map();
    this.financingApplications = /* @__PURE__ */ new Map();
    this.testDrives = /* @__PURE__ */ new Map();
    this.tradeIns = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.vehicleIdCounter = 1;
    this.financingIdCounter = 1;
    this.testDriveIdCounter = 1;
    this.tradeInIdCounter = 1;
    this.initializeDemoData();
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Vehicle operations
  async getVehicle(id) {
    return this.vehicles.get(id);
  }
  async getVehicles(filters) {
    let vehicles = Array.from(this.vehicles.values());
    if (filters) {
      vehicles = vehicles.filter((vehicle) => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === void 0) return true;
          if (key === "price" && typeof value === "object") {
            const min = value.min;
            const max = value.max;
            if (min !== void 0 && vehicle.price < min) return false;
            if (max !== void 0 && vehicle.price > max) return false;
            return true;
          }
          return vehicle[key] === value;
        });
      });
    }
    return vehicles;
  }
  async getFeaturedVehicles() {
    return Array.from(this.vehicles.values()).filter(
      (vehicle) => vehicle.isFeatured
    );
  }
  async createVehicle(insertVehicle) {
    const id = this.vehicleIdCounter++;
    const vehicle = { ...insertVehicle, id };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }
  async updateVehicle(id, updateData) {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return void 0;
    const updatedVehicle = { ...vehicle, ...updateData };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }
  async deleteVehicle(id) {
    return this.vehicles.delete(id);
  }
  // Financing operations
  async getFinancingApplication(id) {
    return this.financingApplications.get(id);
  }
  async getFinancingApplications() {
    return Array.from(this.financingApplications.values());
  }
  async createFinancingApplication(insertApplication) {
    const id = this.financingIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const application = { ...insertApplication, id, createdAt };
    this.financingApplications.set(id, application);
    return application;
  }
  async updateFinancingApplication(id, updateData) {
    const application = this.financingApplications.get(id);
    if (!application) return void 0;
    const updatedApplication = { ...application, ...updateData };
    this.financingApplications.set(id, updatedApplication);
    return updatedApplication;
  }
  // Test drive operations
  async getTestDrive(id) {
    return this.testDrives.get(id);
  }
  async getTestDrives() {
    return Array.from(this.testDrives.values());
  }
  async createTestDrive(insertTestDrive) {
    const id = this.testDriveIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const testDrive = { ...insertTestDrive, id, createdAt };
    this.testDrives.set(id, testDrive);
    return testDrive;
  }
  async updateTestDrive(id, updateData) {
    const testDrive = this.testDrives.get(id);
    if (!testDrive) return void 0;
    const updatedTestDrive = { ...testDrive, ...updateData };
    this.testDrives.set(id, updatedTestDrive);
    return updatedTestDrive;
  }
  // Trade-in operations
  async getTradeIn(id) {
    return this.tradeIns.get(id);
  }
  async getTradeIns() {
    return Array.from(this.tradeIns.values());
  }
  async createTradeIn(insertTradeIn) {
    const id = this.tradeInIdCounter++;
    const createdAt = /* @__PURE__ */ new Date();
    const baseValue = 5e3;
    const yearValue = ((/* @__PURE__ */ new Date()).getFullYear() - insertTradeIn.year) * 500;
    const mileageValue = Math.floor(insertTradeIn.mileage / 1e4) * 1e3;
    let conditionMultiplier = 1;
    switch (insertTradeIn.condition) {
      case "Excellent":
        conditionMultiplier = 1.3;
        break;
      case "Good":
        conditionMultiplier = 1;
        break;
      case "Fair":
        conditionMultiplier = 0.8;
        break;
      case "Poor":
        conditionMultiplier = 0.6;
        break;
    }
    const estimatedValue = Math.max(500, Math.floor((baseValue - yearValue - mileageValue) * conditionMultiplier));
    const tradeIn = {
      ...insertTradeIn,
      id,
      createdAt,
      estimatedValue
    };
    this.tradeIns.set(id, tradeIn);
    return tradeIn;
  }
  async updateTradeIn(id, updateData) {
    const tradeIn = this.tradeIns.get(id);
    if (!tradeIn) return void 0;
    const updatedTradeIn = { ...tradeIn, ...updateData };
    this.tradeIns.set(id, updatedTradeIn);
    return updatedTradeIn;
  }
  // Initialize demo data
  initializeDemoData() {
    this.createUser({
      username: "admin",
      password: "password",
      email: "admin@autodrive.com",
      firstName: "Admin",
      lastName: "User",
      phone: "555-123-4567",
      role: "admin"
    });
    this.createUser({
      username: "user",
      password: "password",
      email: "user@example.com",
      firstName: "Regular",
      lastName: "User",
      phone: "555-987-6543",
      role: "customer"
    });
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
};
var storage = new MemStorage();

// Controllers/vehicleController.ts
import { createRequire } from "module";
import { z } from "zod";
var require2 = createRequire(import.meta.url);
var { insertVehicleSchema } = require2("../shared/validation-schema.cjs");
async function getVehicles(req, res) {
  try {
    const { make, model, bodyType, minPrice, maxPrice, featured } = req.query;
    let filters = {};
    if (make) filters.make = make;
    if (model) filters.model = model;
    if (bodyType) filters.bodyType = bodyType;
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.min = parseInt(minPrice);
      if (maxPrice) filters.price.max = parseInt(maxPrice);
    }
    let vehicles;
    if (featured === "true") {
      vehicles = await storage.getFeaturedVehicles();
    } else {
      vehicles = await storage.getVehicles(filters);
    }
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicles" });
  }
}
async function getVehicleById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await storage.getVehicle(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vehicle" });
  }
}
async function createVehicle(req, res) {
  try {
    const vehicleData = insertVehicleSchema.parse(req.body);
    const vehicle = await storage.createVehicle(vehicleData);
    res.status(201).json(vehicle);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid vehicle data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create vehicle" });
  }
}
async function updateVehicle(req, res) {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await storage.getVehicle(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    const updatedVehicle = await storage.updateVehicle(id, req.body);
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: "Failed to update vehicle" });
  }
}
async function deleteVehicle(req, res) {
  try {
    const id = parseInt(req.params.id);
    const vehicle = await storage.getVehicle(id);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    await storage.deleteVehicle(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vehicle" });
  }
}

// Controllers/userController.ts
import { createRequire as createRequire2 } from "module";
import { z as z2 } from "zod";
var require3 = createRequire2(import.meta.url);
var { insertUserSchema } = require3("../shared/validation-schema.cjs");
async function createUser(req, res) {
  try {
    const userData = insertUserSchema.parse(req.body);
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = await storage.createUser(userData);
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z2.ZodError) {
      return res.status(400).json({ message: "Invalid user data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create user" });
  }
}
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
}

// Controllers/financingController.ts
import { createRequire as createRequire3 } from "module";
import { z as z3 } from "zod";
var require4 = createRequire3(import.meta.url);
var { insertFinancingApplicationSchema } = require4("../shared/validation-schema.cjs");
async function createFinancingApplication(req, res) {
  try {
    const applicationData = insertFinancingApplicationSchema.parse(req.body);
    const application = await storage.createFinancingApplication(applicationData);
    res.status(201).json(application);
  } catch (error) {
    if (error instanceof z3.ZodError) {
      return res.status(400).json({ message: "Invalid application data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to submit financing application" });
  }
}
async function getFinancingApplications(req, res) {
  try {
    const applications = await storage.getFinancingApplications();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch financing applications" });
  }
}
async function getFinancingApplicationById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const application = await storage.getFinancingApplication(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch financing application" });
  }
}

// Controllers/testDriveController.ts
import { createRequire as createRequire4 } from "module";
import { z as z4 } from "zod";
var require5 = createRequire4(import.meta.url);
var { insertTestDriveSchema } = require5("../shared/validation-schema.cjs");
async function createTestDrive(req, res) {
  try {
    const testDriveData = insertTestDriveSchema.parse(req.body);
    const testDrive = await storage.createTestDrive(testDriveData);
    res.status(201).json(testDrive);
  } catch (error) {
    if (error instanceof z4.ZodError) {
      return res.status(400).json({ message: "Invalid test drive data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to schedule test drive" });
  }
}
async function getTestDrives(req, res) {
  try {
    const testDrives = await storage.getTestDrives();
    res.json(testDrives);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch test drives" });
  }
}

// Controllers/tradeInController.ts
import { createRequire as createRequire5 } from "module";
import { z as z5 } from "zod";
var require6 = createRequire5(import.meta.url);
var { insertTradeInSchema } = require6("../shared/validation-schema.cjs");
async function createTradeIn(req, res) {
  try {
    const tradeInData = insertTradeInSchema.parse(req.body);
    const tradeIn = await storage.createTradeIn(tradeInData);
    res.status(201).json(tradeIn);
  } catch (error) {
    if (error instanceof z5.ZodError) {
      return res.status(400).json({ message: "Invalid trade-in data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to submit trade-in request" });
  }
}
async function getTradeIns(req, res) {
  try {
    const tradeIns = await storage.getTradeIns();
    res.json(tradeIns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trade-ins" });
  }
}

// Routes/apiRoutes.ts
async function registerRoutes(app2) {
  const apiRouter = app2;
  apiRouter.get("/api/vehicles", getVehicles);
  apiRouter.get("/api/vehicles/:id", getVehicleById);
  apiRouter.post("/api/vehicles", createVehicle);
  apiRouter.put("/api/vehicles/:id", updateVehicle);
  apiRouter.delete("/api/vehicles/:id", deleteVehicle);
  apiRouter.post("/api/financing", createFinancingApplication);
  apiRouter.get("/api/financing", getFinancingApplications);
  apiRouter.get("/api/financing/:id", getFinancingApplicationById);
  apiRouter.post("/api/test-drives", createTestDrive);
  apiRouter.get("/api/test-drives", getTestDrives);
  apiRouter.post("/api/trade-ins", createTradeIn);
  apiRouter.get("/api/trade-ins", getTradeIns);
  apiRouter.post("/api/users", createUser);
  apiRouter.post("/api/login", loginUser);
  const httpServer = createServer(app2);
  return httpServer;
}

// utils/vite.ts
import express from "express";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
function createSimpleLogger() {
  return {
    info: (msg) => console.log(`[VITE] ${msg}`),
    warn: (msg) => console.warn(`[VITE] ${msg}`),
    error: (msg) => console.error(`[VITE] ${msg}`)
  };
}
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const viteLib = await import("vite");
  console.log("Available vite properties:", Object.keys(viteLib));
  const createServer2 = viteLib["createServer"];
  console.log("createServer type:", typeof createServer2);
  console.log("createServer value:", createServer2);
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const viteLogger = createSimpleLogger();
  const viteServer = await createServer2({
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(viteServer.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await viteServer.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      viteServer.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

// index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();

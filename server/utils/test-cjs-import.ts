import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { 
  insertVehicleSchema, 
  insertFinancingApplicationSchema, 
  insertTestDriveSchema,
  insertTradeInSchema,
  insertUserSchema 
} = require("./shared/validation-schema.cjs");

console.log("Import successful!");
console.log("insertFinancingApplicationSchema:", insertFinancingApplicationSchema);
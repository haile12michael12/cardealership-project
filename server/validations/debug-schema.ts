import * as schema from "../shared/schema";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

console.log("All exports from schema:", Object.keys(schema));
console.log("insertFinancingApplicationSchema:", schema.insertFinancingApplicationSchema);
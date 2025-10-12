import { Request, Response } from "express";
import { storage } from "../Models/storage";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { insertUserSchema } = require("../shared/validation-schema.cjs");

import { z } from "zod";

// Create a new user
export async function createUser(req: Request, res: Response) {
  try {
    const userData = insertUserSchema.parse(req.body);
    
    // Check if username or email already exists
    const existingUsername = await storage.getUserByUsername(userData.username);
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }
    
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    
    const user = await storage.createUser(userData);
    
    // Don't return the password in the response
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid user data", errors: error.errors });
    }
    res.status(500).json({ message: "Failed to create user" });
  }
}

// Mock login route
export async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
}
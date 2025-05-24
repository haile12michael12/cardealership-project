import { useEffect, useState } from "react";
import AdminPanel from "@/components/admin/AdminPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Helmet } from 'react-helmet';
import { Lock } from "lucide-react";

const Admin = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Check if user is already authenticated (in a real app, this would check session)
  useEffect(() => {
    const checkAuth = async () => {
      // For demo, just check local storage
      const isAuth = localStorage.getItem("adminAuthenticated") === "true";
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
  }, []);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // In a real app, this would set a session cookie
        localStorage.setItem("adminAuthenticated", "true");
        setIsAuthenticated(true);
        toast({
          title: "Login successful",
          description: "Welcome to the admin panel",
        });
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin panel",
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | AutoDrive</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="py-8 bg-gray-50 min-h-screen">
        {isAuthenticated ? (
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
            <AdminPanel />
          </div>
        ) : (
          <div className="container mx-auto px-4 flex justify-center items-center min-h-[80vh]">
            <Card className="max-w-md w-full">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">Username</label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Enter your password"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </Button>
                  
                  <div className="text-sm text-center text-gray-500 mt-4">
                    <p>For demonstration, use:</p>
                    <p className="font-medium">Username: admin | Password: password</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;

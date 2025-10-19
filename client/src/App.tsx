import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import Inventory from "@/pages/inventory";
import Vehicle from "@/pages/vehicle";
import Financing from "@/pages/financing";
import TestDrive from "@/pages/test-drive";
import VirtualShowroom from "@/pages/virtual-showroom";
import Admin from "@/pages/admin";
import VinDecoderPage from "@/pages/vin-decoder";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/inventory" component={Inventory} />
          <Route path="/inventory/:id" component={Vehicle} />
          <Route path="/financing" component={Financing} />
          <Route path="/test-drive" component={TestDrive} />
          <Route path="/virtual-showroom" component={VirtualShowroom} />
          <Route path="/admin" component={Admin} />
          <Route path="/vin-decoder" component={VinDecoderPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
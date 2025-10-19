import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/financing", label: "Financing" },
  { href: "/test-drive", label: "Test Drive" },
  { href: "/virtual-showroom", label: "Virtual Showroom" },
  { href: "/admin", label: "Admin" }
];

const Header = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="material-icons text-primary-dark text-3xl">directions_car</span>
              <span className="font-bold text-2xl text-primary-dark">AutoDrive</span>
            </a>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a 
                  className={`nav-link font-medium relative ${
                    location === link.href ? "active" : ""
                  } after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:bottom-[-4px] after:left-0 after:transition-[width] after:duration-300 after:ease ${
                    location === link.href ? "after:w-full" : ""
                  } hover:after:w-full`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <a href="#" className="hidden md:block text-primary hover:text-primary-dark transition">
              <span className="material-icons">account_circle</span>
            </a>
            <a href="#" className="hidden md:block text-primary hover:text-primary-dark transition">
              <span className="material-icons">favorite_border</span>
            </a>
            <Link href="/inventory">
              <Button className="bg-primary text-white px-5 py-2 hover:bg-primary-dark transition">
                Shop Now
              </Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <a 
                        className={`text-lg font-medium ${
                          location === link.href ? "text-primary" : "text-gray-700"
                        } hover:text-primary transition-colors`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </a>
                    </Link>
                  ))}
                </nav>
                <div className="flex flex-col gap-4 mt-8">
                  <Button className="bg-primary text-white hover:bg-primary-dark">
                    Sign In
                  </Button>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    Register
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

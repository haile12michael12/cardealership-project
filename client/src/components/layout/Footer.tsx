import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="material-icons text-white text-3xl">directions_car</span>
              <span className="font-bold text-2xl">AutoDrive</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner in finding the perfect vehicle for your lifestyle and needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300 transition">
                <span className="material-icons">facebook</span>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition">
                <span className="material-icons">send</span>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition">
                <span className="material-icons">photo_camera</span>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition">
                <span className="material-icons">share</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-white transition">Home</a></Link></li>
              <li><Link href="/inventory"><a className="text-gray-400 hover:text-white transition">Inventory</a></Link></li>
              <li><Link href="/financing"><a className="text-gray-400 hover:text-white transition">Financing</a></Link></li>
              <li><Link href="/test-drive"><a className="text-gray-400 hover:text-white transition">Schedule Test Drive</a></Link></li>
              <li><Link href="/virtual-showroom"><a className="text-gray-400 hover:text-white transition">Virtual Showroom</a></Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Trade-In Value</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Vehicles</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">New Vehicles</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Used Vehicles</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Sedans</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">SUVs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Trucks</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Electric Vehicles</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Luxury Cars</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="material-icons mr-2 text-gray-400">location_on</span>
                <span className="text-gray-400">123 Dealership Way<br />Automotive City, AC 12345</span>
              </li>
              <li className="flex items-center">
                <span className="material-icons mr-2 text-gray-400">phone</span>
                <span className="text-gray-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <span className="material-icons mr-2 text-gray-400">email</span>
                <span className="text-gray-400">info@autodrive.com</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons mr-2 text-gray-400">access_time</span>
                <span className="text-gray-400">Mon-Sat: 9AM-7PM<br />Sunday: 10AM-5PM</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AutoDrive. All rights reserved. |{" "}
            <a href="#" className="hover:text-gray-400">Privacy Policy</a> |{" "}
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
          </p>
        </div>
      </div>
      
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-primary hover:bg-primary-dark text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg focus:outline-none transition">
          <span className="material-icons text-2xl">chat</span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;

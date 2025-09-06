import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section 
      className="relative h-[500px] bg-cover bg-center" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1536364127590-1594e3161294?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 h-full flex items-center relative z-10">
        <div className="max-w-2xl text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Drive
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Browse our extensive inventory of premium vehicles and drive home in your dream car today.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/inventory">
              <a className="bg-primary hover:bg-primary-light text-white font-semibold py-3 px-6 rounded-md text-center transition">
                Browse Inventory
              </a>
            </Link>
            <Link href="/inventory">
              <a className="bg-white hover:bg-gray-100 text-primary font-semibold py-3 px-6 rounded-md text-center transition">
                Build Your Car
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

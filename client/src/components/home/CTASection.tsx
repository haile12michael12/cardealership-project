import { Link } from "wouter";

const CTASection = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Drive?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Start your journey today with AutoDrive's personalized car buying experience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/inventory">
            <a className="bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-md text-center transition">
              Browse Inventory
            </a>
          </Link>
          <Link href="/test-drive">
            <a className="border border-white hover:bg-white hover:text-primary font-semibold py-3 px-8 rounded-md text-center transition">
              Schedule Test Drive
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

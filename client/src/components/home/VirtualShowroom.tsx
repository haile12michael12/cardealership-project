import { Link } from "wouter";
import { VIRTUAL_SHOWROOM_BENEFITS } from "@/lib/constants";

const VirtualShowroom = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <img 
              src="https://pixabay.com/get/g8b0cf5da53ab9a511615b4635f51159aa3154de30c94f2100f637a4716889f37c190fe01b8dd45ce0a4be8e7aac555d5118cfa4d040884dbd7484dc332f96ad3_1280.jpg" 
              alt="Virtual automotive showroom" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Experience Our Virtual Showroom</h2>
            <p className="text-gray-600 mb-6">
              Can't visit us in person? No problem! Our interactive virtual showroom allows you to explore 
              every vehicle in 360° detail from the comfort of your home.
            </p>
            <ul className="space-y-3 mb-8">
              {VIRTUAL_SHOWROOM_BENEFITS.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="material-icons text-primary mr-2">check_circle</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/virtual-showroom">
              <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-semibold transition flex items-center">
                <span className="material-icons mr-2">view_in_ar</span>
                Launch Virtual Showroom
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VirtualShowroom;

import { SERVICE_HIGHLIGHTS } from "@/lib/constants";

const ServiceHighlights = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose AutoDrive?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICE_HIGHLIGHTS.map((highlight, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-primary-light inline-flex p-3 rounded-full text-white mb-4">
                <span className="material-icons text-3xl">{highlight.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">{highlight.title}</h3>
              <p className="text-gray-600">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;

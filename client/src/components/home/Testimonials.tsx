import { TESTIMONIALS } from "@/lib/constants";

const Testimonials = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {Array.from({ length: Math.floor(testimonial.rating) }).map((_, i) => (
                    <span key={i} className="material-icons">star</span>
                  ))}
                  {testimonial.rating % 1 !== 0 && (
                    <span className="material-icons">star_half</span>
                  )}
                </div>
                <span className="ml-2 text-gray-600">{testimonial.rating.toFixed(1)}</span>
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <span className="material-icons text-gray-500">person</span>
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

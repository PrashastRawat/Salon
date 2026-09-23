import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <section className="bg-rose-50 py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to Glow Salon
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8 text-sm md:text-base">
          Experience premium salon services tailored just for you. Book your
          appointment in seconds.
        </p>
        <Link
          to="/booking"
          className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition inline-block"
        >
          Book an Appointment
        </Link>
      </section>

      <section className="py-14 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-10">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <h3 className="font-semibold text-lg mb-2">Expert Stylists</h3>
            <p className="text-gray-500 text-sm">
              Our team is trained in the latest techniques and trends.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <h3 className="font-semibold text-lg mb-2">Premium Products</h3>
            <p className="text-gray-500 text-sm">
              We use only quality products for the best results.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <h3 className="font-semibold text-lg mb-2">Easy Booking</h3>
            <p className="text-gray-500 text-sm">
              Book your slot online in under a minute, no calls needed.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-rose-600 py-12 px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          Ready to look and feel your best?
        </h2>
        <Link
          to="/services"
          className="bg-white text-rose-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition inline-block"
        >
          View Our Services
        </Link>
      </section>
    </div>
  );
};

export default Home;
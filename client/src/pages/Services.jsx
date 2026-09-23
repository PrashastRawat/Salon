import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/api/services");
        setServices(res.data.services);
      } catch (err) {
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleBookNow = (serviceId) => {
    navigate(`/booking?service=${serviceId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">
        Our Services
      </h1>

      {loading && <p className="text-center text-gray-500">Loading services...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && services.length === 0 && (
        <p className="text-center text-gray-500">No services available right now.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {service.name}
              </h3>
              <p className="text-gray-500 text-sm mb-4">{service.description}</p>
              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>₹{service.price}</span>
                <span>{service.duration} min</span>
              </div>
            </div>
            <button
              onClick={() => handleBookNow(service._id)}
              className="bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition w-full"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
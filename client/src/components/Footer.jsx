import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-bold mb-3">Glow Salon</h3>
          <p className="text-sm text-gray-400">
            Premium salon services for hair, skin, and beauty care. Book your appointment online in seconds.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition">Home</Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white transition">Services</Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-white transition">Book Now</Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-white transition">Admin Login</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>123 Main Street, Dehradun, Uttarakhand</li>
            <li>+91 98765 43210</li>
            <li>contact@glowsalon.com</li>
            <li>Mon - Sun: 9:00 AM - 8:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Glow Salon. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
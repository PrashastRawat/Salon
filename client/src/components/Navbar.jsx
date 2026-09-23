import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Book Now", path: "/booking" },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold text-rose-600">
          Glow Salon
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-700 hover:text-rose-600 transition"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin/login"
            className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition"
          >
            Admin Login
          </Link>
        </div>

        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-rose-600 py-2"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setIsOpen(false)}
            className="bg-rose-600 text-white text-center px-4 py-2 rounded-lg hover:bg-rose-700 transition"
          >
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
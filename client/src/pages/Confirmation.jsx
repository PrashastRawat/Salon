import { Link } from "react-router-dom";

const Confirmation = () => {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your appointment has been booked successfully. We'll contact you shortly to confirm the details.
        </p>
        <Link
          to="/"
          className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition inline-block"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Confirmation;
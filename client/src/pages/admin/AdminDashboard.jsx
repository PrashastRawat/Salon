import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link } from "react-router-dom";

const statusOptions = ["Pending", "Confirmed", "Completed", "Cancelled"];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await api.get("/api/bookings");
      setBookings(res.data.bookings);
    } catch (err) {
      setError("Failed to load bookings. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/api/bookings/${id}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b)),
      );
      if (selectedBooking && selectedBooking._id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8  p-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <div>
        
        <Link
          to="/admin/services"
          className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition text-center m-2"
        >
          Manage Services
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition self-start sm:self-auto "
        >
          Logout
        </button>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading bookings...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && (
        <p className="text-center text-gray-500">No bookings yet.</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Update</th>
                <th className="px-4 py-3">View</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-b last:border-none">
                  <td className="px-4 py-3">{booking.name}</td>
                  <td className="px-4 py-3">
                    {booking.service?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3">{booking.date}</td>
                  <td className="px-4 py-3">{booking.time}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="text-rose-600 hover:underline text-xs font-medium"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Booking Details
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {selectedBooking.name}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {selectedBooking.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedBooking.email}
              </p>
              <p>
                <span className="font-medium">Service:</span>{" "}
                {selectedBooking.service?.name || "N/A"}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {selectedBooking.date}
              </p>
              <p>
                <span className="font-medium">Time:</span>{" "}
                {selectedBooking.time}
              </p>
              <p>
                <span className="font-medium">Notes:</span>{" "}
                {selectedBooking.notes || "-"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedBooking.status}
              </p>
            </div>
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

// frontend/src/components/AppointmentModal.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAppointment, clearStatus } from "../Redux/Slice/appointmentSlice";

const AppointmentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    timeSlot: "",
    address: "",
    city: "",
    region: "",
  });

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.appointments);

  useEffect(() => {
    if (success) {
      setFormData({
        title: "",
        description: "",
        date: "",
        timeSlot: "",
        address: "",
        city: "",
        region: "",
      });
      dispatch(clearStatus());
      onClose(); // Close modal on success
    }
  }, [success, dispatch, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addAppointment(formData));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  backdrop-blur-sm z-50 p-4 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            type="text"
            placeholder="Appointment Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="timeSlot"
            type="text"
            placeholder="e.g. 10:00 AM - 11:00 AM"
            value={formData.timeSlot}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            name="address"
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="city"
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="region"
            type="text"
            placeholder="Region"
            value={formData.region}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              {loading ? "Booking..." : "Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;

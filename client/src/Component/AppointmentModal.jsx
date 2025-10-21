// frontend/src/components/AppointmentModal.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAppointment, clearStatus } from "../Redux/Slice/appointmentSlice";
import { TimePicker } from "antd";
import dayjs from "dayjs";

const AppointmentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    contactNumber: "",
    mode: "In-Person",
    date: "",
    timeSlot: "",
    address: "",
    city: "",
    region: "",
  });

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (success) {
      setFormData({
        contactNumber: "",
        mode: "In-Person",
        date: "",
        timeSlot: "",
        address: "",
        city: "",
        region: "",
      });
      setStartTime(null);
      setEndTime(null);
      dispatch(clearStatus());
      onClose();
    }
  }, [success, dispatch, onClose]);

  useEffect(() => {
    // Update timeSlot when both times are selected
    if (startTime && endTime) {
      const formattedStartTime = startTime.format("hh:mm A");
      const formattedEndTime = endTime.format("hh:mm A");
      setFormData(prev => ({
        ...prev,
        timeSlot: `${formattedStartTime} - ${formattedEndTime}`
      }));
    }
  }, [startTime, endTime]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!startTime || !endTime) {
      alert("Please select both start and end time");
      return;
    }

    // Include user ID from auth state
    const appointmentData = {
      ...formData,
      user: user?._id || user?.id,
    };

    dispatch(addAppointment(appointmentData));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 p-4 animate-fadeIn">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Book Appointment</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="contactNumber"
            type="tel"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="In-Person">In-Person</option>
            <option value="Virtual">Virtual</option>
          </select>

          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
            min={new Date().toISOString().split('T')[0]}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Time Slot *
            </label>
            <div className="flex gap-2 items-center">
              <TimePicker
                use12Hours
                format="h:mm A"
                placeholder="Start Time"
                value={startTime}
                onChange={setStartTime}
                className="flex-1"
                required
              />
              <span className="text-gray-500">to</span>
              <TimePicker
                use12Hours
                format="h:mm A"
                placeholder="End Time"
                value={endTime}
                onChange={setEndTime}
                className="flex-1"
                required
              />
            </div>
            {formData.timeSlot && (
              <p className="text-sm text-gray-600">
                Selected: {formData.timeSlot}
              </p>
            )}
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm text-gray-700">Location Details</h3>
            
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
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
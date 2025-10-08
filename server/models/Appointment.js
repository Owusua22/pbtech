const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // link to the client/user who books
      
    },
   
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM - 11:00 AM"
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    location: {
      address: String,
      city: String,
      region: String,
      gps: {
        lat: Number,
        lng: Number,
      },
    },
    assignedStaff: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // link to staff user model
      },
    ],

    notes: [
      {
        text: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    archived: {
      type: Boolean,
      default: false, // true if appointment is archived
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);

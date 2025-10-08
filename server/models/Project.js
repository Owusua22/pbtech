const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // link to client model
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    deadline: {
      type: Date,
    },
    budget: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Planned", "Ongoing", "Completed", "On Hold", "Cancelled"],
      default: "Planned",
    },
    progress: {
      type: Number, // percentage (0-100)
      default: 0,
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
        ref: "User", // link to engineers/managers
      },
    ],
    archived: {
      type: Boolean,
      default: false, // true if project is archived
    },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);

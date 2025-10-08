const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  archiveAppointment, // ✅ import
} = require("../controllers/appointmentController");

const { protect, admin } = require("../middleware/authMiddleware");

// User creates appointment → must be logged in
router.post("/", protect, createAppointment);

// Get all appointments → admin only
router.get("/", protect, admin, getAppointments);

// Get single appointment → logged in user (admin can view any)
router.get("/:id", protect, getAppointmentById);

// Update appointment → logged in user (or admin)
router.put("/:id", protect, updateAppointment);

// Soft delete appointment → admin only
router.delete("/:id", protect, admin, deleteAppointment);

// ✅ Archive appointment → admin only
router.put("/:id/archive", protect, admin, archiveAppointment);

module.exports = router;

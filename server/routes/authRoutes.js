const express = require("express");
const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  changePassword,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected user routes
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.delete("/me", protect, deleteUser);
router.put("/me/change-password", protect, changePassword);

// Admin routes
router.get("/", getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id/role", protect, admin, updateUserRole);

module.exports = router;

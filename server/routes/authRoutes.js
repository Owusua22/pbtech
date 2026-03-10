const express = require("express");
const {
  register,
  login,
  registerAdmin,
  adminLogin,
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

/*
-----------------------------
Public Routes
-----------------------------
*/
router.post("/register", register);
router.post("/login", login);

/*
-----------------------------
Admin Auth Routes
-----------------------------
*/
router.post("/admin/register", registerAdmin);
router.post("/admin/login", adminLogin);

/*
-----------------------------
Protected User Routes
-----------------------------
*/
router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.delete("/me", protect, deleteUser);
router.put("/me/change-password", protect, changePassword);

/*
-----------------------------
Admin Routes
-----------------------------
*/
router.get("/", protect, admin, getAllUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id/role", protect, admin, updateUserRole);

module.exports = router;
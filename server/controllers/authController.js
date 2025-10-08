const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ token: generateToken(user._id), user });
  } catch (err) {
    res.status(400).json({ error: "Registration failed", message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ token: generateToken(user._id), user });
};
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json(user);
};
exports.updateUserProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }
  await user.save();
  res.json({ message: "Profile updated successfully", user });
};
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
};
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};
exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
};  
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.role = role;
  await user.save();
  res.json({ message: "User role updated successfully", user });
};
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });  
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ error: "Current password is incorrect" });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    res.json({ message: "Password changed successfully" });
}

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Log requests only in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ✅ Import routes
const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const imageRoutes = require("./routes/imageRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/appointments", appointmentRoutes);

// ✅ Root route — for Render and health checks
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running successfully on Render 🚀");
});

// ✅ Catch-all route for unknown endpoints
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ✅ Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

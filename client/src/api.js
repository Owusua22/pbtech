import axios from "axios";

// Use environment variable (fallback to localhost for dev)
const API = axios.create({
  baseURL: "https://backend-b4ae.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token automatically if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ---------- AUTH ----------

// Public routes
export const registerUser = (userData) => API.post("/auth/register", userData);
export const loginUser = (credentials) => API.post("/auth/login", credentials);

// Protected user routes
export const getProfile = () => API.get("/auth/me");
export const updateProfile = (updatedData) => API.put("/auth/me", updatedData);
export const deleteProfile = () => API.delete("/auth/me");
export const changePassword = (passwords) =>
  API.put("/auth/me/change-password", passwords);

// Admin routes
export const getAllUsers = () => API.get("/auth");
export const getUserById = (id) => API.get(`/auth/${id}`);
export const updateUserRole = (id, role) =>
  API.put(`/auth/${id}/role`, { role });

// ---------- CLIENTS ----------
export const getClients = () => API.get("/clients");
export const createClient = (clientData) => API.post("/clients", clientData);
export const updateClient = (id, clientData) =>
  API.put(`/clients/${id}`, clientData);
export const deleteClient = (id) => API.delete(`/clients/${id}`);

// ---------- PROJECTS ----------
export const getProjects = () => API.get("/projects");
export const createProject = (projectData) => API.post("/projects", projectData);
export const updateProject = (id, projectData) =>
  API.put(`/projects/${id}`, projectData);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const toggleArchiveProject = (id) =>
  API.patch(`/projects/${id}/archive`);
export const getProjectsByClient = (clientId) =>
  API.get(`/projects/client/${clientId}`);
export const getProjectsByUser = (userId) =>
  API.get(`/projects/user/${userId}`);

// ---------- MEDIA APIs (legacy project media) ----------
export const uploadProjectMedia = (projectId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(`/projects/${projectId}/media`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProjectMedia = (projectId, mediaId) =>
  API.delete(`/projects/${projectId}/media/${mediaId}`);




// ---------- TASKS ----------
export const getTasks = () => API.get("/tasks");
export const createTask = (taskData) => API.post("/tasks", taskData);
export const updateTask = (id, taskData) => API.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);
// ---------- APPOINTMENTS ----------
export const getAppointments = () => API.get("/appointments");

export const getAppointmentById = (id) => API.get(`/appointments/${id}`);

export const createAppointment = (appointmentData) =>
  API.post("/appointments", appointmentData);

export const updateAppointment = (id, appointmentData) =>
  API.put(`/appointments/${id}`, appointmentData);

export const deleteAppointment = (id) => API.delete(`/appointments/${id}`);

// ✅ Archive appointment (soft delete)
export const archiveAppointment = (id) =>
  API.put(`/appointments/${id}/archive`);
// ---------- IMAGES (Cloudinary Integrated) ----------


// 📤 Upload new image
export const uploadImage = (file, name) => {
  const formData = new FormData();
  formData.append("file", file);
  if (name) formData.append("name", name);

  return API.post("/images/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// 📸 Get all images
export const getImages = () => API.get("/images");

// 🗑️ Delete image
export const deleteImage = (id) => API.delete(`/images/${id}`);

// ✏️ Update image (name or replace file)
export const updateImage = (id, file, name) => {
  const formData = new FormData();

  // Only append fields if provided
  if (file) formData.append("file", file);
  if (name) formData.append("name", name);

  return API.put(`/images/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};




export default API;

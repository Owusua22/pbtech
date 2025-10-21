import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startTokenExpiryWatcher, logout } from "./Redux/Slice/authSlice";
import Navbar from "./Component/Navbar";

// Public pages
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import About from "./Pages/About";
import Service from "./Pages/Service";
import Contact from "./Pages/Contact";
import ProjectsPage from "./Pages/ProjectsPage";

// Admin pages
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Users from "./Pages/Admin/Users";
import Clients from "./Pages/Admin/Clients";
import Projects from "./Pages/Admin/Projects";
import Task from "./Pages/Admin/Task";
import Dashboard from "./Pages/Admin/Dashboard";
import AppointmentsPage from "./Pages/Admin/Appointments";
import Media from "./Pages/Admin/Media";

/* ✅ Auto Scroll to Top on Route Change */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

/* ✅ Layout wrapper that hides Navbar on admin routes */
function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
    </>
  );
}

/* ✅ Protected Route Wrapper for Admin Pages */
function ProtectedAdminRoute() {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user); // assuming user object has role
  const dispatch = useDispatch();

  // If no token or invalid user role → redirect to home
  if (!token || user?.role !== "admin") {
    dispatch(logout());
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Render child admin routes
}

/* ✅ Main AppContent with routing logic */
function AppContent() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // ✅ Watch token expiry and auto logout
  useEffect(() => {
    if (token) {
      startTokenExpiryWatcher(dispatch, token);
    } else {
      dispatch(logout());
    }
  }, [dispatch, token]);

  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<ProjectsPage />} />

          {/* ✅ Protected Admin routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route element={<AdminDashboard />}>
              {/* Auto redirect /admin → /admin/users */}
              <Route index element={<Navigate to="users" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="clients" element={<Clients />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Task />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="media" element={<Media />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </>
  );
}

/* ✅ App wrapper with Router */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

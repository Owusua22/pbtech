import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";

// Public pages
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

// Admin dashboard layout
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Users from "./Pages/Admin/Users";
import Clients from "./Pages/Admin/Clients";
import Projects from "./Pages/Admin/Projects";
import Task from "./Pages/Admin/Task";
import Dashboard from "./Pages/Admin/Dashboard";
import About from "./Pages/About";
import Service from "./Pages/Service";
import Contact from "./Pages/Contact";
import AppointmentsPage from "./Pages/Admin/Appointments";
import Media from "./Pages/Admin/Media";
import ProjectsPage from "./Pages/ProjectsPage";



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<ProjectsPage />} />

        {/* Admin Dashboard routes */}
        <Route path="/admin" element={<AdminDashboard />}>
   <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="clients" element={<Clients/>} />
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Task />} />
          <Route path="appointments" element={<AppointmentsPage/>} />
          <Route path="media" element={<Media />} />

            

        
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

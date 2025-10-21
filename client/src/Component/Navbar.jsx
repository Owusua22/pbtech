import React, { useState } from "react";
import { Menu, X, Phone, Mail, MapPin, User, LogOut, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slice/authSlice";
import logo from "../assets/pblogo.png";

import AppointmentModal from "./AppointmentModal";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const phoneNumber = "+233244245257"; // no spaces for tel/whatsapp
  const emailAddress = "pbtechconst@gmail.com";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleBookAppointment = () => {
    if (!user) setShowRegistrationModal(true);
    else setShowAppointmentModal(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* ✅ Top Contact Bar */}
      <div className="hidden md:block bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              {/* Clickable Call */}
              <a
                href={`tel:${phoneNumber}`}
                className="flex items-center space-x-2 hover:text-orange-400 transition-colors"
              >
                <Phone size={14} />
                <span>{`+233 244 245 257`}</span>
              </a>

            
              {/* Clickable Email */}
              <a
                href={`mailto:${emailAddress}`}
                className="flex items-center space-x-2 hover:text-orange-400 transition-colors"
              >
                <Mail size={14} />
                <span>{emailAddress}</span>
              </a>

              {/* Location (non-clickable) */}
              <div className="flex items-center space-x-2 hover:text-orange-400 transition-colors cursor-default">
                <MapPin size={14} />
                <span>Dobro-East, Nsawam</span>
              </div>
            </div>

            <div className="text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Mon - Fri: 8:00 AM - 6:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                {/* Logo Image */}
                <img 
                  src={logo} 
                  alt="P Btech Logo" 
                  className="h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              
              {/* Company Name */}
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                  P Btech
                </h1>
                <p className="text-xs text-orange-500 font-semibold tracking-wider uppercase">
                  Building Excellence
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                        : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                    }`}
                  >
                    {item.name}
                    {location.pathname === item.path && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button & Avatar - Desktop */}
            <div className="hidden md:flex items-center space-x-4 relative">
              <button
                onClick={handleBookAppointment}
                className="group relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Book Appointment</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center space-x-3 focus:outline-none group"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg ring-2 ring-white group-hover:ring-orange-500 transition-all duration-300">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <span className="text-gray-800 font-semibold group-hover:text-orange-500 transition-colors">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <User className="mr-3 h-4 w-4" /> My Profile
                      </button>
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="bg-gray-50 inline-flex items-center justify-center p-2.5 rounded-xl text-gray-700 hover:text-orange-500 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-4 pt-4 pb-4 space-y-2 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
            {user && (
              <div className="flex items-center space-x-3 px-4 py-3 bg-white rounded-xl border border-gray-200 mb-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={22} />}
                </div>
                <div>
                  <span className="text-gray-800 font-semibold block">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
                    : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                }`}
              >
                {item.name}
              </button>
            ))}

            {/* Mobile CTA */}
            <div className="pt-3">
              <button
                onClick={() => {
                  handleBookAppointment();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
              >
                Book Appointment
              </button>
            </div>

            {user && (
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 px-4 py-3 rounded-xl font-semibold transition-all duration-200 border border-red-200"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Modals */}
      <AuthModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={() => {
          setShowRegistrationModal(false);
          setShowAppointmentModal(true);
        }}
      />

      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
      />
    </header>
  );
};

export default Navbar;
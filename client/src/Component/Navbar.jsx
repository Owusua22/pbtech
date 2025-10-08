import React, { useState } from "react";
import { Menu, X, Phone, Mail, MapPin, User, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slice/authSlice";

// Import your modals
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

  const { user } = useSelector((state) => state.auth); // ✅ get user from Redux

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleBookAppointment = () => {
    if (!user) {
      setShowRegistrationModal(true);
    } else {
      setShowAppointmentModal(true);
    }
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
      {/* Top contact bar */}
      <div className="hidden md:block bg-blue-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span>+233244245257</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span>info@constructionco.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={14} />
                <span>Nsawam-Dobro</span>
              </div>
            </div>
            <div className="text-sm">Mon - Fri: 8:00 AM - 6:00 PM</div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-orange-500 text-white p-2 rounded-lg mr-3">
                <div className="w-6 h-6 flex items-center justify-center font-bold text-lg">
                  P
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">P Btech</h1>
                <p className="text-xs text-gray-500">Building Excellence</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      location.pathname === item.path
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button & Avatar - Desktop */}
            <div className="hidden md:flex items-center space-x-4 relative">
              <button
                onClick={handleBookAppointment}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Book Appointment
              </button>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                    </div>
                    <span className="text-gray-800 font-medium">{user.name}</span>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => navigate("/profile")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="mr-2 h-4 w-4" /> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
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
                className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 border-t border-gray-200">
            {user && (
              <div className="flex items-center space-x-2 px-3 py-2 border-b border-gray-200">
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />}
                </div>
                <span className="text-gray-800 font-medium">{user.name}</span>
              </div>
            )}

            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:text-orange-500 hover:bg-white"
                }`}
              >
                {item.name}
              </button>
            ))}

            {/* Mobile CTA */}
            <div className="px-3 py-2">
              <button
                onClick={handleBookAppointment}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-lg"
              >
                Book Appointment
              </button>
            </div>

            {user && (
              <div className="px-3 py-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
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

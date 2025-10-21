import React, { useState } from "react";
import {
  Users,
  Briefcase,
  BookCopy,
  UserCog,
  LayoutDashboard,
  Image,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Menu,
  X,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/Slice/authSlice";

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const menuItems = [
    
    {
      key: "users",
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      key: "clients",
      label: "Clients",
      icon: UserCog,
      path: "/admin/clients",
    },
    {
      key: "projects",
      label: "Projects",
      icon: Briefcase,
      path: "/admin/projects",
    },
    {
      key: "appointments",
      label: "Appointments",
      icon: BookCopy,
      path: "/admin/appointments",
    },
    {
      key: "media",
      label: "Media",
      icon: Image,
      path: "/admin/media",
    },
  ];

  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } shadow-2xl`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center py-6 px-4 border-b border-blue-800/50">
          {collapsed ? (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">P</span>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-white text-2xl font-bold tracking-wide">
                P Btech
              </h1>
              <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mt-1">
                Admin Panel
              </p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30 text-white"
                    : "text-blue-100 hover:bg-blue-800/50 hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? "text-white" : "text-blue-300"}
                />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
                {active && !collapsed && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-blue-800/50">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full bg-blue-800/50 hover:bg-blue-700/70 text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center font-medium"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <>
                <ChevronLeft size={20} className="mr-2" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white shadow-2xl">
            <div className="flex items-center justify-between py-6 px-4 border-b border-blue-800/50">
              <div className="text-center flex-1">
                <h1 className="text-white text-xl font-bold">P Btech</h1>
                <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider">
                  Admin Panel
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="px-3 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg text-white"
                        : "text-blue-100 hover:bg-blue-800/50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-gray-700 hover:text-orange-500 transition-colors"
            >
              <Menu size={24} />
            </button>

            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-blue-900">
                {menuItems.find((item) => isActive(item.path))?.label ||
                  "Dashboard"}
              </h2>
              <p className="text-xs lg:text-sm text-gray-500 mt-0.5">
                Manage your business operations
              </p>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 lg:px-4 py-2 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Online</span>
            </div>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex items-center space-x-2 lg:space-x-3 focus:outline-none group"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
                      {user.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.role || "Administrator"}
                    </p>
                  </div>
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-base lg:text-lg shadow-lg ring-2 ring-white group-hover:ring-orange-500 transition-all duration-300">
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-orange-50 border-b border-gray-200">
                        <p className="text-sm font-bold text-gray-800">
                          {user.name || "Admin User"}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {user.email || "admin@pbtech.com"}
                        </p>
                      </div>
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
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
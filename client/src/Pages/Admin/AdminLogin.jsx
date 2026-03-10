// frontend/src/pages/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { adminLogin } from "../../Redux/Slice/authSlice";
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight, AlertCircle, CheckCircle, Building2 } from "lucide-react";
import logo from "../../assets/pblogo.png";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user && user.role === "admin") {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-950 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/10 rounded-full blur-2xl" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <img src={logo} alt="P Btech Logo" className="h-20 w-auto" />
            <div className="ml-4">
              <h1 className="text-3xl font-bold">P Btech</h1>
              <p className="text-orange-400 font-semibold tracking-wider text-sm">BUILDING EXCELLENCE</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-semibold text-sm">ADMIN PORTAL</span>
            </div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Welcome to the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                Admin Dashboard
              </span>
            </h2>
            <p className="text-blue-200 text-lg max-w-md">
              Manage appointments, users, projects, and more from your centralized admin panel.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              "Manage user appointments",
              "Track project progress",
              "Handle inquiries & messages",
              "Generate reports & analytics"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src={logo} alt="P Btech Logo" className="h-16 w-auto" />
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-white">P Btech</h1>
              <p className="text-orange-400 font-semibold text-xs">ADMIN PORTAL</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
            {/* Decorative corner */}
           
            
            {/* Header */}
            <div className="relative mb-8">
            
              <h3 className="text-2xl font-bold text-blue-900">Admin Sign In</h3>
              <p className="text-gray-500 mt-1">Enter your credentials to continue</p>
            </div>

            {/* Error Alert */}
            {error && !showSuccess && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-red-800">Authentication Failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {showSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-green-800">Login Successful!</p>
                  <p className="text-sm text-green-600 mt-0.5">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'email' ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className={`w-5 h-5 transition-colors ${
                      focusedField === 'email' ? 'text-orange-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="admin@pbtech.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-gray-800 placeholder-gray-400"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'password' ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${
                      focusedField === 'password' ? 'text-orange-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-gray-800 placeholder-gray-400"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || showSuccess}
                className="w-full mt-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-xl font-semibold text-base transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative overflow-hidden group"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Signing In...</span>
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Success!</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">New admin?</span>
              </div>
            </div>

            {/* Register Link */}
            <Link
              to="/admin/register"
              className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-blue-900 text-blue-900 rounded-xl font-semibold hover:bg-blue-900 hover:text-white transition-all duration-300"
            >
         
              <span>Register here</span>
            </Link>

            {/* Back to Website */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
              >
                ← Back to Website
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-blue-200/60 text-sm mt-8">
            © 2024 P Btech Construction. All rights reserved.
          </p>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;
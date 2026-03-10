// frontend/src/pages/AdminRegister.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { adminRegister } from "../../Redux/Slice/authSlice";
import { 
  Mail, Lock, Eye, EyeOff, Shield, ArrowRight, AlertCircle, 
  CheckCircle, User, Key, Building2, Phone 
} from "lucide-react";
import logo from "../../assets/pblogo.png";

const AdminRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
   
    password: "",
    confirmPassword: "",

  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

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
    setValidationError("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const { confirmPassword, ...submitData } = formData;
    dispatch(adminRegister(submitData));
  };

  // Password strength calculator
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];

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
              <span className="text-orange-300 font-semibold text-sm">ADMIN REGISTRATION</span>
            </div>
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Reister to Manage<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">
                Your Projects
              </span>
            </h2>
            
          </div>

        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-6">
            <img src={logo} alt="P Btech Logo" className="h-14 w-auto" />
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white">P Btech</h1>
              <p className="text-orange-400 font-semibold text-xs">ADMIN REGISTRATION</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative overflow-hidden">
            {/* Decorative corner */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full blur-2xl" />
            
            {/* Header */}
            <div className="relative mb-6">
             
              <h3 className="text-2xl font-bold text-blue-900">Create Admin Account</h3>
          
            </div>

            {/* Error Alert */}
            {(error || validationError) && !showSuccess && (
              <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-shake">
                <div className="flex-shrink-0 w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm font-semibold text-red-800">Registration Failed</p>
                  <p className="text-sm text-red-600">{validationError || error}</p>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {showSuccess && (
              <div className="mb-5 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-green-800">Registration Successful!</p>
                  <p className="text-sm text-green-600 mt-0.5">Redirecting to dashboard...</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'name' ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className={`w-5 h-5 transition-colors ${
                      focusedField === 'name' ? 'text-orange-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-gray-800 placeholder-gray-400 text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'email' ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-gray-800 placeholder-gray-400 text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

           

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'password' ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-gray-800 placeholder-gray-400 text-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[0, 1, 2, 3].map((index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            index < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      passwordStrength < 2 ? 'text-red-500' : 
                      passwordStrength < 3 ? 'text-orange-500' : 
                      passwordStrength < 4 ? 'text-yellow-600' : 'text-green-500'
                    }`}>
                      {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Enter a password'}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className={`relative rounded-xl transition-all duration-200 ${
                  focusedField === 'confirmPassword' ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-500/20' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${
                      focusedField === 'confirmPassword' ? 'text-orange-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-orange-500 focus:outline-none transition-all text-gray-800 placeholder-gray-400 text-sm"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <p className={`text-xs mt-1 flex items-center gap-1 ${
                    formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Passwords don't match
                      </>
                    )}
                  </p>
                )}
              </div>


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || showSuccess}
                className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3.5 rounded-xl font-semibold text-base transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none relative overflow-hidden group"
              >
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating Account...</span>
                    </>
                  ) : showSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Success!</span>
                    </>
                  ) : (
                    <>
                      <span>Create Admin Account</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/admin/login"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-blue-900 text-blue-900 rounded-xl font-semibold hover:bg-blue-900 hover:text-white transition-all duration-300"
            >
              <Shield className="w-5 h-5" />
              <span>Sign In </span>
            </Link>

            {/* Back to Website */}
            <div className="mt-5 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-orange-500 transition-colors"
              >
                ← Back to Website
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-blue-200/60 text-sm mt-6">
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

export default AdminRegister;
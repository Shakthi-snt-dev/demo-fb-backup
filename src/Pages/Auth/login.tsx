import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaEnvelope, FaLock, FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import { useToast } from '../../components/Toast';
import Loading from '../../components/Loading';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser } from '../../Slices/Login/Login-slice';
import loginimg from '../../assets/login/loging-siteimg1.png';
import logo from '../../assets/logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, token } = useAppSelector((state) => state.login);
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      console.log(result);
      
      // Verify login was successful
      if (result.data.success ===true) {
        // Success - show toast with API response message
        navigate('/dashboard');

        showToast({ 
          message: result.data.message || 'Login successful!', 
          type: 'success' 
        });
      } 
      else {
        // Login response indicates failure
        showToast({ 
          message: result.message || 'Login failed. Please check your credentials.', 
          type: 'error' 
        });
      }
    } catch (error: any) {
      // Error - show toast with API error message
      showToast({ 
        message: error?.detail || error?.message || 'Login failed. Please check your credentials.', 
        type: 'error' 
      });
    }
  };

  return (
    <main className="min-h-screen bg-white flex">
      <div className="w-full flex flex-col lg:flex-row">
        {/* Left Column - Login Form */}
        <div className="w-full lg:w-2/5 xl:w-2/5 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 py-8 lg:py-12">
          <div className="max-w-md w-full mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <img src={logo} alt="FlowTap" className="h-10 mb-2" />
              <p className="text-sm text-gray-600">Built to power every checkout</p>
            </div>

            {/* Login Heading */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-sm text-gray-600 mb-8">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaEnvelope className="text-sm" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077EF2] focus:border-[#077EF2] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <FaLock className="text-sm" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#077EF2] focus:border-[#077EF2] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-[#077EF2] hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#077EF2] text-white px-4 py-3 rounded-lg hover:bg-[#0668D1] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#077EF2] focus:ring-offset-2 transition-all flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <>
                    <Loading size="small" color="#fff" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign in</span>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or Continue With</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all bg-white"
                  aria-label="Sign in with Google"
                >
                  <FaGoogle className="w-5 h-5 text-red-500" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all bg-white"
                  aria-label="Sign in with GitHub"
                >
                  <FaGithub className="w-5 h-5 text-gray-800" />
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 hover:border-gray-400 hover:shadow-sm transition-all bg-white"
                  aria-label="Sign in with Facebook"
                >
                  <FaFacebook className="w-5 h-5 text-blue-600" />
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Don't have an account yet?{' '}
                <Link to="/register" className="text-[#077EF2] hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Right Column - Image with Gradient */}
        <div className="hidden lg:flex lg:w-3/5 xl:w-3/5 relative bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-8">
          <div className="max-w-2xl w-full flex flex-col items-center justify-center">
            {/* Image */}
            <div className="mb-8 w-full flex justify-center">
              <img 
                src={loginimg} 
                alt="Welcome illustration" 
                className="max-w-full h-auto object-contain"
              />
            </div>
            
            {/* Welcome Text */}
            <div className="text-center">
              <h2 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
                Welcome to Flowtap
              </h2>
              <p className="text-lg text-gray-700 max-w-md mx-auto">
                One-Stop Destination for Expert Gadget Repairs! Bringing your devices back to life — fast, reliable, and affordable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;


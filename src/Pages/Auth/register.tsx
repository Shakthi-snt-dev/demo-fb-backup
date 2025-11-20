import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import loginimg from '../../assets/login/loging-siteimg1.png';
import { useToast } from '../../components/Toast';
import Loading from "../../components/Loading";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { registerUser } from '../../Slices/Register/Register-slice';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.register);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    try {
      const result = await dispatch(registerUser({
        email,
        username,
        password,
        confirmPassword,
      })).unwrap();
      
      // Success - show toast with API response message
      showToast({ 
        message: result.message || 'Registration successful! Please check your email to verify your account.', 
        type: 'success' 
      });
      
      // Reset form on success
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      // Error - show toast with API error message
      showToast({ 
        message: error?.detail || error?.message || 'Registration failed', 
        type: 'error' 
      });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-3 xs:px-4 sm:px-6 bg-gray-50 py-4"
      style={{ backgroundImage: `url($)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="w-full max-w-full sm:max-w-md md:max-w-5xl bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg md:shadow-xl overflow-hidden border border-white/40 flex flex-col mx-2">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Side - Hidden on mobile, visible on tablet and up */}
          <div className="hidden md:block relative">
            <div
              className="h-full w-full min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[400px] bg-cover bg-center"
              style={{ backgroundImage: `url(${loginimg})` }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-transparent to-white/40"></div>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-3 xs:p-4 sm:p-6 md:p-8 flex items-center justify-center w-full">
            <Card 
              variant="elevated"
              rounded="lg"
              padding="md"
              className="mx-2 w-full" >
              <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-4 sm:space-y-5 px-2 xs:px-3 sm:px-4 py-2 xs:py-3">
                <div className="text-center sm:text-left">
                  <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold xs:font-extrabold text-gray-800">Create Account</h1>
                  <p className="mt-1 xs:mt-2 text-xs xs:text-sm text-gray-600">Sign up to get started with Flow-Tap</p>
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-xs xs:text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="relative mt-1 xs:mt-1.5">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaUser className="text-sm xs:text-base" />
                    </span>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="block w-full pl-9 xs:pl-10 pr-3 py-2 xs:py-2.5 text-xs xs:text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs xs:text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative mt-1 xs:mt-1.5">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaEnvelope className="text-sm xs:text-base" />
                    </span>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="block w-full pl-9 xs:pl-10 pr-3 py-2 xs:py-2.5 text-xs xs:text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-xs xs:text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1 xs:mt-1.5">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaLock className="text-sm xs:text-base" />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="block w-full pl-9 xs:pl-10 pr-10 py-2 xs:py-2.5 text-xs xs:text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaEyeSlash className="text-sm xs:text-base" /> : <FaEye className="text-sm xs:text-base" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs xs:text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mt-1 xs:mt-1.5">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <FaLock className="text-sm xs:text-base" />
                    </span>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="block w-full pl-9 xs:pl-10 pr-10 py-2 xs:py-2.5 text-xs xs:text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Toggle password visibility"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <FaEyeSlash className="text-sm xs:text-base" /> : <FaEye className="text-sm xs:text-base" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-linear-to-r from-[#FFB58A] to-[#FFD7BA] text-gray-900 py-3 xs:py-3 rounded-lg hover:from-[#FFA66A] flex items-center justify-center gap-2 xs:gap-3 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] text-sm xs:text-base font-medium min-h-11"
                >
                  {isLoading ? (
                    <>
                      <Loading size="small" color="#4A5568" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>

                {/* Social Registration Section */}
                <div className="space-y-3 xs:space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs xs:text-sm">
                      <span className="px-2 xs:px-3 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 xs:gap-3">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1 px-2 py-1.5 xs:px-3 xs:py-2 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 hover:border-gray-300 text-xs xs:text-sm"
                      aria-label="Sign up with Google"
                    >
                      <FaGoogle className="w-3 h-3 xs:w-4 xs:h-4 text-red-500" />
                      <span className="text-gray-700 hidden xs:inline">Google</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1 px-2 py-1.5 xs:px-3 xs:py-2 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 hover:border-gray-300 text-xs xs:text-sm"
                      aria-label="Sign up with GitHub"
                    >
                      <FaGithub className="w-3 h-3 xs:w-4 xs:h-4 text-gray-800" />
                      <span className="text-gray-700 hidden xs:inline">GitHub</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-1 px-2 py-1.5 xs:px-3 xs:py-2 rounded-lg border border-gray-200 hover:shadow-sm transition-all duration-200 hover:border-gray-300 text-xs xs:text-sm"
                      aria-label="Sign up with Facebook"
                    >
                      <FaFacebook className="w-3 h-3 xs:w-4 xs:h-4 text-blue-600" />
                      <span className="text-gray-700 hidden xs:inline">Facebook</span>
                    </button>
                  </div>
                </div>

                {/* Login Link */}
                <p className="text-center text-xs xs:text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="#" className="text-orange-600 hover:text-orange-800 font-medium">
                    Sign in here
                  </a>
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

// src/pages/Login/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogInIcon, UserIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (loginError) {
      setLoginError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLoginError('Please enter both email and password');
      return;
    }

    const browserId = localStorage.getItem("browserId") || crypto.randomUUID();
    localStorage.setItem("browserId", browserId);

    const loginData = {
      userId: browserId,
      emailOrUsername: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://192.168.100.53:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        navigate("/");
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#071428] p-4">
      <div className="bg-[#0A1D3D] rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#00FF88] mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your account to continue</p>
        </div>

        {loginError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-4">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 bg-[#071428] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 bg-[#071428] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
                placeholder="••••••••"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-400" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#00FF88] focus:ring-[#00FF88] bg-[#071428] border-gray-700 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-[#00BFFF] hover:text-[#00FF88]">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-[#00FF88] to-[#00BFFF] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <LogInIcon className="h-5 w-5 mr-2" />
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-300">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-[#00BFFF] hover:text-[#00FF88]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

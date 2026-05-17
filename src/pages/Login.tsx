import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // We use "username" internally to match the Spring Boot payload perfectly
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const token = res.data?.token || res.data;
      login(token); // AuthContext securely stores token

      navigate("/"); // Redirect home
    } catch (err: any) {
      const backendError = err.response?.data?.message || err.response?.data || "Login failed. Please check your credentials.";
      setError(typeof backendError === 'string' ? backendError : "Login failed.");
      console.error("Full Login Error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side: Dark Ecommerce Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" 
          alt="SwiftCart Logistics" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute bottom-16 left-16 right-16 text-white">
          <h2 className="text-5xl font-bold tracking-tighter mb-6">
            Speed. Selection. <br/>Simplified.
          </h2>
          <p className="text-gray-300 text-xl max-w-md leading-relaxed">
            "Your cart, delivered at the speed of life. Experience the next generation of seamless shopping with SwiftCart."
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-16 md:px-24">
        
        {/* Logo */}
        <div className="mb-10 text-center">
          <Link to="/" className="flex items-center gap-2 justify-center text-3xl font-black text-blue-600 tracking-tighter">
            <img src="/logo.png" alt="SwiftCart Logo" className="h-10 w-auto" />
            <span>SwiftCart<span className="text-slate-900">.</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8 text-sm">
            Enter your credentials to access your SwiftCart account.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Display errors cleanly */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-semibold border border-red-100">
                {error}
              </div>
            )}

            {/* Email / Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-2">
                Username / Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="alex (or email)"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
                  Password
                </label>
                <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Verifying...' : 'Login to SwiftCart'}
            </button>
          </form>

          {/* Fixed Sign Up Link */}
          <p className="text-center mt-8 text-slate-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">
              Create a SwiftCart account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
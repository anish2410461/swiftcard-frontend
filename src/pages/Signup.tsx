import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios'; 

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', // Matches @NotBlank private String username
    email: '',    // Matches @Email private String email
    password: '', // Matches @Size(min = 6) private String password
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend validation before hitting the backend
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);
    try {
      // 1. Create the payload to match ecommerse.project.dto.RegisterRequest
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      // 2. Call your Spring Boot /register endpoint
      await API.post('/auth/register', payload);
      
      console.log("Registration Successful! Please login.");
      navigate('/login');

    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || "Registration failed. Username or Email might be taken.";
      setError(typeof msg === 'string' ? msg : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side: Brand Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900">
        <img 
          src="https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=1000&auto=format&fit=crop" 
          alt="Shopping" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute top-20 left-16 right-16 text-white">
          <h2 className="text-5xl font-extrabold tracking-tighter mb-4 italic">
            Join the <br/> SwiftCart Tribe.
          </h2>
          <div className="w-20 h-1.5 bg-blue-600 mb-8 rounded-full"></div>
          <p className="text-gray-300 text-xl max-w-sm leading-relaxed font-light">
            "Your journey to seamless shopping starts with a single click. Welcome to SwiftCart."
          </p>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-16 md:px-24 py-10 overflow-y-auto">
        
        <div className="mb-8 text-center">
          <Link to="/" className="flex items-center gap-2 justify-center text-3xl font-black text-blue-600 tracking-tighter hover:text-blue-700 transition">
            <img src="/logo.png" alt="SwiftCart Logo" className="h-10 w-auto" />
            <span>SwiftCart<span className="text-slate-900">.</span></span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center lg:text-left">Create Account</h2>
          <p className="text-slate-500 mb-6 text-sm font-medium text-center lg:text-left">
            Join SwiftCart and start your seamless shopping journey.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <input 
                type="text" 
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Unique identifier (e.g. ashwin_dev)"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                required 
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                required 
              />
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Password
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="6+ chars"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                  required 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5">
                  Confirm
                </label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat pass"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all outline-none"
                  required 
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all mt-4 flex items-center justify-center ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : ''}
              {loading ? 'Validating...' : 'Create SwiftCart Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-slate-600 text-sm">
            Already a member?{' '}
            <Link to="/login" className="text-blue-600 font-bold hover:underline transition-all">
              Sign in to SwiftCart
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

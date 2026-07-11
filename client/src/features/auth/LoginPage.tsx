import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      // Force hard redirect to dashboard
      window.location.href = '/';
    } catch (error: any) {
      const message = error?.details?.detail || error?.message || 'Login failed';
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-center">Sign In</h2>
      
      <div>
        <label htmlFor="email" className="block text-sm font-semibold mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50 outline-none"
          placeholder="sysadmin@medivoice.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 bg-gray-50 focus:border-emerald-700 focus:ring-2 focus:ring-emerald-50 outline-none"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-700 text-white rounded-full px-6 py-3 font-semibold text-sm hover:bg-emerald-800 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-emerald-700 font-semibold hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}

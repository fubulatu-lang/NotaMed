import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-title-lg text-center">Create Account</h2>
      
      <div>
        <label htmlFor="fullName" className="block text-label-lg mb-2">
          Full Name (Optional)
        </label>
        <input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          className="input-field"
          placeholder="Dr. Jane Smith"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-label-lg mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input-field"
          placeholder="doctor@hospital.com"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-label-lg mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="input-field"
          placeholder="Min. 8 characters"
          required
          minLength={8}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-label-lg mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="input-field"
          placeholder="Repeat password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-center text-body-md text-on-surface-variant">
        Already have an account?{' '}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}

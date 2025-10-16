import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Please check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Matte vignette + gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(800px_400px_at_80%_20%,rgba(59,130,246,0.10),transparent_60%)]" />

      {/* Split Screen Layout */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Logo */}
        <div className="hidden lg:flex items-center justify-center p-12">
          <div className="text-center">
            <img
              src="/Abt-Electronics.png"
              alt="Abt Electronics"
              className="w-full max-w-md mx-auto mb-8"
            />
            <p className="text-xl text-white/70">Warranty Mailer Portal</p>
            <p className="text-sm text-white/50 mt-2">
              Manage your warranty campaigns with ease
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <img
                src="/Abt-Electronics.png"
                alt="Abt Electronics"
                className="h-12 w-auto mx-auto mb-4"
              />
              <p className="text-sm text-white/70">Warranty Mailer Portal</p>
            </div>

            <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
              {/* Header */}
              <div className="p-8 border-b border-white/10">
                <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-sm text-white/70">
                  Sign in to manage your campaigns
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {error && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-500/10 ring-1 ring-red-500/30 p-4">
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@abtwarranty.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white/70 mb-2"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 focus:border-sky-400/50 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sky-500/20 px-6 py-3 text-sm font-medium text-sky-300 hover:bg-sky-500/30 transition ring-1 ring-sky-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogIn className="h-4 w-4" />
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Demo credentials */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/50 text-center">
                    Demo credentials:
                  </p>
                  <p className="text-xs text-white/70 text-center mt-1">
                    Email: <span className="text-sky-400">admin@abtwarranty.com</span>
                  </p>
                  <p className="text-xs text-white/70 text-center">
                    Password: <span className="text-sky-400">admin123</span>
                  </p>
                </div>
              </form>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-white/40 mt-6">
              © 2025 Abt Electronics. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

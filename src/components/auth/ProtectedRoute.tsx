import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-black relative overflow-hidden flex items-center justify-center">
        {/* Matte vignette + gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(800px_400px_at_80%_20%,rgba(59,130,246,0.10),transparent_60%)]" />

        <div className="relative z-10 text-center">
          <Loader2 className="h-8 w-8 text-sky-400 animate-spin mx-auto mb-4" />
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return <>{children}</>;
}

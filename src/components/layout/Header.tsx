import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Menu } from 'lucide-react';
import { Chip } from '../ui/Chip';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/20 bg-black/10">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          <img
            src="/Abt-Electronics.png"
            alt="Abt Electronics"
            className="h-32 w-auto"
          />
          <div className="h-6 w-px bg-white/15" />
          <p className="text-white/70 hidden sm:block">
            The Warranty Mailer Portal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Chip tone="muted">v1.0</Chip>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 rounded-full bg-sky-500/20 text-sky-300 px-3 py-1.5 text-sm hover:bg-sky-500/30 transition"
            >
              <User className="h-3 w-3" />
              <span className="hidden sm:inline">{user?.name || 'Admin'}</span>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#1a1d23] ring-1 ring-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden z-20">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-xs text-white/50">Signed in as</p>
                    <p className="text-sm text-white font-medium truncate">
                      {user?.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 transition"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

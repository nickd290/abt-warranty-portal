import { NavLink } from 'react-router-dom';
import { Package, FileText } from 'lucide-react';

const navigation = [
  { name: 'Campaigns', href: '/campaigns', icon: Package },
  { name: 'Invoices', href: '/invoices', icon: FileText },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-30
          bg-white/5 border-r border-white/10 flex-shrink-0 flex flex-col
          transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:border-0 w-64'}
        `}
      >
        {/* Navigation */}
        <nav className={`flex-1 p-6 space-y-2 ${!isOpen ? 'lg:opacity-0' : ''}`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/30'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`border-t border-white/10 p-4 ${!isOpen ? 'lg:opacity-0' : ''}`}>
          <p className="text-xs text-white/40">
            Warranty Mailer Portal v1.0
          </p>
        </div>
      </aside>
    </>
  );
}

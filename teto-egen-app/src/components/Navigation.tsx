import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Heart, Users, HelpCircle } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { path: '/', label: '테스트', icon: <Home size={20} /> },
  { path: '/result', label: '결과', icon: <Heart size={20} /> },
  { path: '/match', label: '궁합', icon: <Users size={20} /> },
  { path: '/about', label: '알아보기', icon: <HelpCircle size={20} /> }
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl border-t border-glass-border">
      <div className="flex justify-around items-center py-3 px-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-lovely-pink bg-white/20' 
                  : 'text-charcoal-light hover:text-charcoal hover:bg-white/10'
              }`}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
      {/* Safe Area Padding */}
      <div className="h-4" />
    </nav>
  );
};
import React from 'react';
import { LayoutDashboard, Users, Star, Gift, BarChart3, Settings, HelpCircle, CreditCard } from 'lucide-react';
import Logo from './Logo';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: Star, label: 'Reviews', path: '/reviews' },
  { icon: Gift, label: 'Loyalty', path: '/loyalty' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: CreditCard, label: 'NFC Cards', path: '/nfc-management' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: HelpCircle, label: 'Support', path: '/support' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-screen w-64 bg-[#336633] text-white p-6">
      <div className="mb-10">
        <Logo />
      </div>
      
      <nav>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors
              ${location.pathname === item.path
                ? 'bg-[#FFE816] text-[#336633] font-medium' 
                : 'hover:bg-[#336633]/80 text-gray-100'}`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
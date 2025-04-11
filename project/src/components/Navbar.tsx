import { Home, Heart, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-rose-600' : 'text-gray-500';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-md mx-auto flex justify-around py-3">
        <Link to="/" className={`${isActive('/')} p-2`}>
          <Home className="w-6 h-6" />
        </Link>
        <Link to="/messages" className={`${isActive('/messages')} p-2`}>
          <Heart className="w-6 h-6" />
        </Link>
        <Link to="/profile" className={`${isActive('/profile')} p-2`}>
          <User className="w-6 h-6" />
        </Link>
        <Link to="/settings" className={`${isActive('/settings')} p-2`}>
          <Settings className="w-6 h-6" />
        </Link>
      </div>
    </nav>
  );
}
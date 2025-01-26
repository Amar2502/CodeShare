import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { app } from '@/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { 
  Terminal,
  Bell,
  MessageSquare,
  Menu,
  LogIn
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const auth = getAuth(app)

const Header = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Terminal className="h-6 w-6 text-purple-400" />
          </div>
        </div>
      </header>
    );
  }

  // Header for non-authenticated users on homepage
  if (!user && isHomePage) {
    return (
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <Terminal className="h-6 w-6 text-purple-400" />
                <span className="text-xl font-bold text-white">DevConnect</span>
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login-page">
                <Button variant="ghost" className="text-gray-300 hover:text-black">
                  Login
                </Button>
              </Link>
              <Link to="/registration-page">
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Header for authenticated users
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Terminal className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold text-white">DevConnect</span>
            </Link>
            
            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/feed" className="text-gray-300 hover:text-white">
                Feed
              </Link>
              <Link to="/editor" className="text-gray-300 hover:text-white">
                Code Editor
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-300 hover:text-white md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Button 
              onClick={() => auth.signOut()} 
              variant="ghost"
              className="text-gray-300 hover:text-white"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
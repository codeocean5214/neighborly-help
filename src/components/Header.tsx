import React, { useState } from 'react';
import { Bell, User, Plus, MessageCircle, Map, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import AuthModal from './AuthModal';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  unreadNotifications: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, unreadNotifications }) => {
  const { isAuthenticated, user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleSignOut = () => {
    signOut();
    setShowUserMenu(false);
    onViewChange('feed');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NH</span>
                </div>
                <h1 className="ml-3 text-xl font-bold text-gray-900 hidden sm:block">
                  NeighborlyHelp
                </h1>
              </div>
            </div>

            {/* Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => onViewChange('feed')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'feed'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Help Feed
                </button>
                <button
                  onClick={() => onViewChange('map')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'map'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Map View
                </button>
                <button
                  onClick={() => onViewChange('my-requests')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'my-requests'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  My Requests
                </button>
              </nav>
            )}

            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => onViewChange('create-request')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Post Request</span>
                  </button>
                  
                  <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>

                  <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                      <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                    </button>

                    {showUserMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowUserMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                          <div className="p-2">
                            <button
                              onClick={() => {
                                onViewChange('profile');
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                            >
                              <User className="w-4 h-4" />
                              <span>View Profile</span>
                            </button>
                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="flex justify-around py-2">
              <button
                onClick={() => onViewChange('feed')}
                className={`flex flex-col items-center py-2 px-3 text-xs ${
                  currentView === 'feed' ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Bell className="w-5 h-5 mb-1" />
                Feed
              </button>
              <button
                onClick={() => onViewChange('map')}
                className={`flex flex-col items-center py-2 px-3 text-xs ${
                  currentView === 'map' ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Map className="w-5 h-5 mb-1" />
                Map
              </button>
              <button
                onClick={() => onViewChange('my-requests')}
                className={`flex flex-col items-center py-2 px-3 text-xs ${
                  currentView === 'my-requests' ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <User className="w-5 h-5 mb-1" />
                My Requests
              </button>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default Header;
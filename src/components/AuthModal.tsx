import React, { useState } from 'react';
import { X, Shield, Users, Heart, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import GoogleSignIn from './GoogleSignIn';
import LanguageSelector from './LanguageSelector';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [error, setError] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleSuccess = () => {
    setIsSigningIn(false);
    setError('');
    onSuccess();
    onClose();
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsSigningIn(false);
  };

  const handleSignInStart = () => {
    setIsSigningIn(true);
    setError('');
  };

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasValidClientId = clientId && clientId !== 'demo-client-id' && clientId !== 'your_google_client_id_here';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NH</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Join NeighborlyHelp</h2>
          </div>
          <div className="flex items-center space-x-2">
            <LanguageSelector />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSigningIn}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Welcome Message */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome to Your Community
            </h3>
            <p className="text-gray-600 text-sm">
              Connect with neighbors to give and receive help in your local area
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Connect with Neighbors</div>
                <div className="text-xs text-gray-600">Find help and offer assistance in your community</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Verified & Safe</div>
                <div className="text-xs text-gray-600">All users are verified with ratings and reviews</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Build Community</div>
                <div className="text-xs text-gray-600">Strengthen local connections and mutual support</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900 text-sm">Local Focus</div>
                <div className="text-xs text-gray-600">Help is always nearby and relevant to your area</div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {isSigningIn && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-blue-600 text-sm">Signing you in...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Google Sign In */}
          <div className="space-y-4">
            <div onClick={handleSignInStart}>
              <GoogleSignIn onSuccess={handleSuccess} onError={handleError} />
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Configuration Status */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              {hasValidClientId ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              )}
              <div>
                <p className="text-blue-800 text-sm font-medium mb-1">
                  {hasValidClientId ? 'Google OAuth Configured' : 'Demo Mode Active'}
                </p>
                <p className="text-blue-700 text-xs">
                  {hasValidClientId 
                    ? 'You can now sign in with your Google account securely.'
                    : 'Using demo mode for testing. Configure Google OAuth for production use.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
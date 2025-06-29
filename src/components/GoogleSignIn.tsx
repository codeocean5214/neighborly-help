import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, CheckCircle } from 'lucide-react';

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess, onError }) => {
  const { signIn } = useAuth();
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const hasValidClientId = clientId && clientId !== 'demo-client-id' && clientId !== 'your_google_client_id_here';

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      try {
        if (window.google && googleButtonRef.current && hasValidClientId) {
          // Clear any existing content
          googleButtonRef.current.innerHTML = '';
          
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            locale: 'en',
          });

          setIsLoading(false);
          setError('');
          setIsInitialized(true);
          console.log('Google Sign-In initialized successfully');
        } else if (!hasValidClientId) {
          setIsLoading(false);
          setError('Google Client ID not configured');
        }
      } catch (err) {
        console.error('Google Sign-In initialization error:', err);
        setError('Failed to initialize Google Sign-In');
        setIsLoading(false);
      }
    };

    const handleCredentialResponse = async (response: any) => {
      try {
        setError('');
        console.log('Google credential received, processing...');
        await signIn(response.credential);
        console.log('Sign-in successful');
        onSuccess?.();
      } catch (error) {
        console.error('Sign in failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
        setError(errorMessage);
        onError?.(errorMessage);
      }
    };

    // Check if Google Identity Services is already loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log('Google Identity Services script loaded');
        // Wait a bit for the library to fully initialize
        setTimeout(initializeGoogleSignIn, 200);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
        setError('Failed to load Google Sign-In');
        setIsLoading(false);
      };
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [signIn, onSuccess, onError, clientId, hasValidClientId]);

  // Demo mode fallback
  const handleDemoSignIn = async () => {
    try {
      setError('');
      console.log('Starting demo sign-in...');
      
      // Create a mock JWT token for demo purposes
      const mockPayload = {
        sub: 'demo-user-123',
        name: 'Demo User',
        email: 'demo@neighborlyhelp.com',
        email_verified: true,
        picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      };
      
      // Create a simple mock JWT (not secure, just for demo)
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify(mockPayload));
      const signature = 'demo-signature';
      const mockCredential = `${header}.${payload}.${signature}`;
      
      await signIn(mockCredential);
      console.log('Demo sign-in successful');
      onSuccess?.();
    } catch (error) {
      console.error('Demo sign in failed:', error);
      const errorMessage = 'Demo sign in failed';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-gray-50">
        <Loader2 className="w-4 h-4 animate-spin text-gray-600 mr-2" />
        <span className="text-gray-600 text-sm">Loading Google Sign-In...</span>
      </div>
    );
  }

  // Show demo mode if no valid client ID
  if (!hasValidClientId) {
    return (
      <div className="w-full space-y-3">
        <button
          onClick={handleDemoSignIn}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-gray-700 font-medium">Continue with Google (Demo)</span>
        </button>
        <p className="text-xs text-gray-500 text-center">
          Demo mode - Click to sign in with a test account
        </p>
      </div>
    );
  }

  // Show error state
  if (error && hasValidClientId) {
    return (
      <div className="w-full space-y-3">
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full text-xs text-red-600 hover:text-red-700 underline text-center"
        >
          Try again
        </button>
      </div>
    );
  }

  // Show success state when initialized
  if (isInitialized && hasValidClientId) {
    return (
      <div className="w-full space-y-3">
        <div ref={googleButtonRef} className="w-full"></div>
        <div className="flex items-center justify-center space-x-2 text-xs text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span>Google Sign-In ready</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={googleButtonRef} className="w-full"></div>
    </div>
  );
};

export default GoogleSignIn;
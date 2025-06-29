import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types';

interface AuthContextType extends AuthState {
  signIn: (credential: string) => Promise<void>;
  signOut: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('neighborly_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          user: {
            ...user,
            joinedDate: new Date(user.joinedDate)
          },
          loading: false
        });
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('neighborly_user');
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const signIn = async (credential: string) => {
    try {
      // Decode the JWT credential from Google
      const parts = credential.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid credential format');
      }

      const payload = JSON.parse(atob(parts[1]));
      
      // Validate required fields
      if (!payload.sub || !payload.email || !payload.name) {
        throw new Error('Missing required user information');
      }
      
      const user: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        address: '', // Will be set during onboarding
        verified: payload.email_verified || false,
        avatar: payload.picture,
        rating: 5.0,
        totalHelped: 0,
        totalRequests: 0,
        joinedDate: new Date(),
        googleId: payload.sub,
        preferredLanguage: navigator.language.split('-')[0] || 'en',
        bio: '',
        stripeCustomerId: undefined,
        stripeAccountId: undefined,
        paymentMethods: []
      };

      // Save to localStorage (in a real app, this would be saved to your backend)
      localStorage.setItem('neighborly_user', JSON.stringify(user));
      
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false
      });

      console.log('User signed in successfully:', user.name);
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error('Failed to sign in. Please try again.');
    }
  };

  const signOut = () => {
    localStorage.removeItem('neighborly_user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });

    // Sign out from Google
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }

    console.log('User signed out successfully');
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('neighborly_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser
      }));
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      signIn,
      signOut,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
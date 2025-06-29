import React, { createContext, useContext, useState, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Payment, PaymentMethod } from '../types';

interface PaymentContextType {
  stripe: Stripe | null;
  createPaymentIntent: (amount: number, currency: string, description: string) => Promise<string>;
  confirmPayment: (clientSecret: string, paymentMethodId: string) => Promise<boolean>;
  addPaymentMethod: (paymentMethodId: string) => Promise<void>;
  getPaymentMethods: () => PaymentMethod[];
  processPayment: (requestId: string, amount: number, receiverId: string) => Promise<boolean>;
  isProcessing: boolean;
  error: string | null;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

interface PaymentProviderProps {
  children: ReactNode;
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo');

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  React.useEffect(() => {
    stripePromise.then(setStripe);
  }, []);

  const createPaymentIntent = async (amount: number, currency: string, description: string): Promise<string> => {
    try {
      setError(null);
      setIsProcessing(true);

      // In a real app, this would call your backend API
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret } = await response.json();
      return client_secret;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = async (clientSecret: string, paymentMethodId: string): Promise<boolean> => {
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    try {
      setError(null);
      setIsProcessing(true);

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId,
      });

      if (error) {
        setError(error.message || 'Payment failed');
        return false;
      }

      return paymentIntent?.status === 'succeeded';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const addPaymentMethod = async (paymentMethodId: string): Promise<void> => {
    try {
      // In a real app, this would save to your backend
      const mockPaymentMethod: PaymentMethod = {
        id: paymentMethodId,
        type: 'card',
        last4: '4242',
        brand: 'visa',
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: paymentMethods.length === 0,
      };

      setPaymentMethods(prev => [...prev, mockPaymentMethod]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
      throw err;
    }
  };

  const getPaymentMethods = (): PaymentMethod[] => {
    return paymentMethods;
  };

  const processPayment = async (requestId: string, amount: number, receiverId: string): Promise<boolean> => {
    try {
      setError(null);
      setIsProcessing(true);

      // Mock payment processing for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would:
      // 1. Create payment intent
      // 2. Process payment through Stripe
      // 3. Update database with payment record
      // 4. Send notifications to both parties

      console.log('Processing payment:', { requestId, amount, receiverId });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment processing failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PaymentContext.Provider value={{
      stripe,
      createPaymentIntent,
      confirmPayment,
      addPaymentMethod,
      getPaymentMethods,
      processPayment,
      isProcessing,
      error
    }}>
      {children}
    </PaymentContext.Provider>
  );
};
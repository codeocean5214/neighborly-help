import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Gift, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePayment } from '../contexts/PaymentContext';
import { HelpRequest } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: HelpRequest;
  onSuccess: () => void;
  paymentType: 'service' | 'donation' | 'tip';
}

const PaymentForm: React.FC<{
  request: HelpRequest;
  paymentType: 'service' | 'donation' | 'tip';
  onSuccess: () => void;
  onClose: () => void;
}> = ({ request, paymentType, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { processPayment, isProcessing, error } = usePayment();
  const [amount, setAmount] = useState(request.suggestedAmount || 10);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const finalAmount = useCustomAmount ? parseFloat(customAmount) || 0 : amount;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    try {
      // Create payment method
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (methodError) {
        console.error('Payment method error:', methodError);
        return;
      }

      // Process payment
      const success = await processPayment(request.id, finalAmount, request.requesterId);
      
      if (success) {
        setPaymentSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const getPaymentTitle = () => {
    switch (paymentType) {
      case 'service':
        return 'Pay for Service';
      case 'donation':
        return 'Make a Donation';
      case 'tip':
        return 'Leave a Tip';
      default:
        return 'Make Payment';
    }
  };

  const getPaymentDescription = () => {
    switch (paymentType) {
      case 'service':
        return 'Pay for the requested service';
      case 'donation':
        return 'Support this community member';
      case 'tip':
        return 'Show appreciation for the help received';
      default:
        return 'Complete your payment';
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">
          Your payment of ${finalAmount.toFixed(2)} has been processed successfully.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Amount
        </label>
        
        {paymentType !== 'service' && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[10, 25, 50].map((presetAmount) => (
              <button
                key={presetAmount}
                type="button"
                onClick={() => {
                  setAmount(presetAmount);
                  setUseCustomAmount(false);
                }}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  !useCustomAmount && amount === presetAmount
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                ${presetAmount}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            id="customAmount"
            checked={useCustomAmount}
            onChange={(e) => setUseCustomAmount(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="customAmount" className="text-sm text-gray-700">
            Custom amount
          </label>
        </div>

        {useCustomAmount && (
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              step="0.01"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="p-4 border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="font-medium">${finalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Processing fee:</span>
          <span className="font-medium">${(finalAmount * 0.029 + 0.30).toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-lg">${(finalAmount + finalAmount * 0.029 + 0.30).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing || finalAmount <= 0}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Pay ${finalAmount.toFixed(2)}</span>
          </>
        )}
      </button>
    </form>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, request, onSuccess, paymentType }) => {
  const { stripe } = usePayment();

  if (!isOpen) return null;

  const getIcon = () => {
    switch (paymentType) {
      case 'service':
        return <CreditCard className="w-6 h-6 text-blue-600" />;
      case 'donation':
        return <Gift className="w-6 h-6 text-green-600" />;
      case 'tip':
        return <DollarSign className="w-6 h-6 text-yellow-600" />;
      default:
        return <CreditCard className="w-6 h-6 text-blue-600" />;
    }
  };

  const getTitle = () => {
    switch (paymentType) {
      case 'service':
        return 'Pay for Service';
      case 'donation':
        return 'Make a Donation';
      case 'tip':
        return 'Leave a Tip';
      default:
        return 'Make Payment';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Request Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-1">{request.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Requested by {request.requester.name}</span>
              {request.requester.verified && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
          </div>

          {/* Payment Form */}
          {stripe ? (
            <Elements stripe={stripe}>
              <PaymentForm
                request={request}
                paymentType={paymentType}
                onSuccess={onSuccess}
                onClose={onClose}
              />
            </Elements>
          ) : (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading payment system...</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              🔒 Your payment is secured by Stripe. We never store your card information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
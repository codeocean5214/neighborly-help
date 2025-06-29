import React, { useState } from 'react';
import { Clock, MapPin, User, MessageCircle, CheckCircle, AlertCircle, DollarSign, Gift } from 'lucide-react';
import { HelpRequest } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import TranslatedText from './TranslatedText';
import PaymentModal from './PaymentModal';

interface HelpRequestCardProps {
  request: HelpRequest;
  onOfferHelp: (requestId: string) => void;
  onViewDetails: (requestId: string) => void;
  currentUserId: string;
}

const HelpRequestCard: React.FC<HelpRequestCardProps> = ({
  request,
  onOfferHelp,
  onViewDetails,
  currentUserId
}) => {
  const { isAuthenticated } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState<'service' | 'donation' | 'tip'>('service');

  const getCategoryColor = (category: string) => {
    const colors = {
      'education': 'bg-purple-100 text-purple-800',
      'errands': 'bg-blue-100 text-blue-800',
      'donations': 'bg-green-100 text-green-800',
      'skills': 'bg-orange-100 text-orange-800',
      'elder-care': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-red-600'
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-600';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in-progress':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPaymentIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'paid':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'donation':
        return <Gift className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const handlePayment = (type: 'service' | 'donation' | 'tip') => {
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    // In a real app, this would update the request status or show success message
    alert('Payment successful! The helper has been notified.');
  };

  const isOwnRequest = request.requesterId === currentUserId;

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(request.category)}`}>
                {request.category.charAt(0).toUpperCase() + request.category.slice(1).replace('-', ' ')}
              </span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(request.status)}
                <span className="text-xs text-gray-600 capitalize">{request.status.replace('-', ' ')}</span>
              </div>
              {request.paymentType !== 'free' && (
                <div className="flex items-center space-x-1">
                  {getPaymentIcon(request.paymentType)}
                  <span className="text-xs text-gray-600">
                    {request.paymentType === 'paid' ? `$${request.suggestedAmount?.toFixed(2)}` : 'Tips welcome'}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              <TranslatedText 
                text={request.title} 
                originalLanguage={request.originalLanguage}
                showTranslateButton={false}
              />
            </h3>
          </div>
          <div className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
            {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} priority
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-700 mb-4 line-clamp-3">
          <TranslatedText 
            text={request.description} 
            originalLanguage={request.originalLanguage}
            showTranslateButton={true}
          />
        </div>

        {/* Location and Time */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{request.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
          </div>
        </div>

        {/* Requester Info */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            {request.requester.avatar ? (
              <img
                src={request.requester.avatar}
                alt={request.requester.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{request.requester.name}</span>
              {request.requester.verified && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>⭐ {request.requester.rating.toFixed(1)}</span>
              <span>{request.requester.totalHelped} helped</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onViewDetails(request.id)}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            <span>View Details</span>
          </button>
          
          <div className="flex items-center space-x-2">
            {isAuthenticated && !isOwnRequest && request.status === 'open' && (
              <>
                <button
                  onClick={() => onOfferHelp(request.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Offer Help
                </button>
                
                {request.paymentType === 'paid' && (
                  <button
                    onClick={() => handlePayment('service')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Pay ${request.suggestedAmount?.toFixed(2)}</span>
                  </button>
                )}
                
                {request.paymentType === 'donation' && (
                  <button
                    onClick={() => handlePayment('donation')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium flex items-center space-x-1"
                  >
                    <Gift className="w-4 h-4" />
                    <span>Donate</span>
                  </button>
                )}
              </>
            )}

            {request.offers.length > 0 && (
              <span className="text-sm text-gray-600">
                {request.offers.length} {request.offers.length === 1 ? 'offer' : 'offers'}
              </span>
            )}
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        request={request}
        onSuccess={handlePaymentSuccess}
        paymentType={paymentType}
      />
    </>
  );
};

export default HelpRequestCard;
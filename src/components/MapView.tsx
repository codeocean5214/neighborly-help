import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import { Clock, MapPin, User, Star, MessageCircle } from 'lucide-react';
import { HelpRequest } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface MapViewProps {
  requests: HelpRequest[];
  onRequestSelect: (requestId: string) => void;
}

// Custom marker component
const CustomMarker: React.FC<{
  request: HelpRequest;
  onRequestSelect: (requestId: string) => void;
}> = ({ request, onRequestSelect }) => {
  const getCategoryClass = (category: string) => {
    const classes = {
      'education': 'marker-education',
      'errands': 'marker-errands',
      'donations': 'marker-donations',
      'skills': 'marker-skills',
      'elder-care': 'marker-elder-care'
    };
    return classes[category as keyof typeof classes] || 'marker-errands';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'low': 'text-green-600',
      'medium': 'text-yellow-600',
      'high': 'text-red-600'
    };
    return colors[urgency as keyof typeof colors] || 'text-gray-600';
  };

  const customIcon = divIcon({
    html: `<div class="marker-pin ${getCategoryClass(request.category)}"></div>`,
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  return (
    <Marker
      position={[request.latitude!, request.longitude!]}
      icon={customIcon}
    >
      <Popup className="custom-popup" minWidth={280} maxWidth={320}>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
                {request.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  request.category === 'education' ? 'bg-purple-100 text-purple-800' :
                  request.category === 'errands' ? 'bg-blue-100 text-blue-800' :
                  request.category === 'donations' ? 'bg-green-100 text-green-800' :
                  request.category === 'skills' ? 'bg-orange-100 text-orange-800' :
                  'bg-pink-100 text-pink-800'
                }`}>
                  {request.category.charAt(0).toUpperCase() + request.category.slice(1).replace('-', ' ')}
                </span>
                <span className={`text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                  {request.urgency} priority
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {request.description}
          </p>

          {/* Location and Time */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>{request.location}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</span>
            </div>
          </div>

          {/* Requester */}
          <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-gray-900 truncate">
                  {request.requester.name}
                </span>
                {request.requester.verified && (
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span>{request.requester.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{request.requester.totalHelped} helped</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={() => onRequestSelect(request.id)}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
            >
              <MessageCircle className="w-3 h-3" />
              <span>View Details</span>
            </button>
            {request.status === 'open' && (
              <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-xs font-medium hover:bg-green-700 transition-colors">
                Offer Help
              </button>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Component to fit map bounds to markers
const FitBounds: React.FC<{ requests: HelpRequest[] }> = ({ requests }) => {
  const map = useMap();

  useEffect(() => {
    if (requests.length > 0) {
      const validRequests = requests.filter(r => r.latitude && r.longitude);
      if (validRequests.length > 0) {
        const bounds = validRequests.map(request => [request.latitude!, request.longitude!] as [number, number]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [requests, map]);

  return null;
};

const MapView: React.FC<MapViewProps> = ({ requests, onRequestSelect }) => {
  const [mapCenter] = useState<[number, number]>([40.7589, -73.9851]); // NYC coordinates
  const validRequests = requests.filter(request => request.latitude && request.longitude);

  const getCategoryStats = () => {
    const stats = {
      education: 0,
      errands: 0,
      donations: 0,
      skills: 0,
      'elder-care': 0
    };
    
    validRequests.forEach(request => {
      stats[request.category]++;
    });
    
    return stats;
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Help Map</h2>
          <p className="text-gray-600">
            Showing {validRequests.length} help {validRequests.length === 1 ? 'request' : 'requests'} in your area
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{validRequests.filter(r => r.status === 'open').length}</span> open requests
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">{validRequests.filter(r => r.urgency === 'high').length}</span> urgent
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {validRequests.map((request) => (
              <CustomMarker
                key={request.id}
                request={request}
                onRequestSelect={onRequestSelect}
              />
            ))}
            
            <FitBounds requests={validRequests} />
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Request Categories</h3>
          <div className="space-y-2">
            {[
              { category: 'education', label: 'Education', color: 'bg-purple-600' },
              { category: 'errands', label: 'Errands', color: 'bg-blue-600' },
              { category: 'donations', label: 'Donations', color: 'bg-green-600' },
              { category: 'skills', label: 'Skills/Services', color: 'bg-orange-600' },
              { category: 'elder-care', label: 'Elder Care', color: 'bg-pink-600' }
            ].map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                  <span className="text-xs text-gray-700">{item.label}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {categoryStats[item.category as keyof typeof categoryStats]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <button className="bg-white rounded-lg shadow-lg p-2 hover:bg-gray-50 transition-colors">
            <MapPin className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{validRequests.length}</div>
          <div className="text-sm text-gray-600">Total Requests</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {validRequests.filter(r => r.status === 'open').length}
          </div>
          <div className="text-sm text-gray-600">Open Requests</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-red-600">
            {validRequests.filter(r => r.urgency === 'high').length}
          </div>
          <div className="text-sm text-gray-600">Urgent</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            {validRequests.filter(r => r.status === 'completed').length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
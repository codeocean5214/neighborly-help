import React, { useState } from 'react';
import Header from './components/Header';
import HelpRequestCard from './components/HelpRequestCard';
import CreateRequestForm from './components/CreateRequestForm';
import FilterPanel from './components/FilterPanel';
import UserProfile from './components/UserProfile';
import MapView from './components/MapView';
import AuthModal from './components/AuthModal';
import { mockRequests } from './data/mockData';
import { HelpRequest, Filter } from './types';
import { Search } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('feed');
  const [requests, setRequests] = useState<HelpRequest[]>(mockRequests);
  const [filters, setFilters] = useState<Filter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCreateRequest = (requestData: any) => {
    if (!user) return;
    
    const newRequest: HelpRequest = {
      ...requestData,
      id: Date.now().toString(),
      requesterId: user.id,
      requester: user,
      createdAt: new Date(),
      offers: [],
      originalLanguage: user.preferredLanguage || 'en'
    };
    setRequests([newRequest, ...requests]);
    setCurrentView('feed');
  };

  const handleOfferHelp = (requestId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // In a real app, this would open a modal or form to submit an offer
    console.log('Offering help for request:', requestId);
    alert('Help offer functionality would be implemented here');
  };

  const handleViewDetails = (requestId: string) => {
    // In a real app, this would show detailed view with messages
    console.log('Viewing details for request:', requestId);
    alert('Request details view would be implemented here');
  };

  const filteredRequests = requests.filter(request => {
    if (searchTerm && !request.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !request.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.category && request.category !== filters.category) {
      return false;
    }
    
    if (filters.urgency && request.urgency !== filters.urgency) {
      return false;
    }
    
    if (filters.status && request.status !== filters.status) {
      return false;
    }

    if (filters.paymentType && request.paymentType !== filters.paymentType) {
      return false;
    }
    
    return true;
  });

  const myRequests = user ? requests.filter(request => request.requesterId === user.id) : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-sm">NH</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!isAuthenticated && currentView !== 'feed') {
      setCurrentView('feed');
    }

    switch (currentView) {
      case 'create-request':
        if (!isAuthenticated) {
          setShowAuthModal(true);
          setCurrentView('feed');
          return null;
        }
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CreateRequestForm
              onSubmit={handleCreateRequest}
              onCancel={() => setCurrentView('feed')}
            />
          </div>
        );

      case 'profile':
        if (!isAuthenticated || !user) {
          setShowAuthModal(true);
          setCurrentView('feed');
          return null;
        }
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserProfile
              user={user}
              isOwnProfile={true}
              onEdit={() => alert('Edit profile functionality would be implemented here')}
            />
          </div>
        );

      case 'map':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MapView
              requests={filteredRequests}
              onRequestSelect={handleViewDetails}
            />
          </div>
        );

      case 'my-requests':
        if (!isAuthenticated) {
          setShowAuthModal(true);
          setCurrentView('feed');
          return null;
        }
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h2>
            <div className="space-y-6">
              {myRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">You haven't posted any requests yet.</p>
                  <button
                    onClick={() => setCurrentView('create-request')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Post Your First Request
                  </button>
                </div>
              ) : (
                myRequests.map(request => (
                  <HelpRequestCard
                    key={request.id}
                    request={request}
                    onOfferHelp={handleOfferHelp}
                    onViewDetails={handleViewDetails}
                    currentUserId={user?.id || ''}
                  />
                ))
              )}
            </div>
          </div>
        );

      default: // feed
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Search and Filter Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search help requests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="relative">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    isOpen={showFilters}
                    onToggle={() => setShowFilters(!showFilters)}
                  />
                </div>
              </div>
            </div>

            {/* Welcome Banner */}
            {!searchTerm && Object.keys(filters).length === 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 mb-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to NeighborlyHelp! 👋</h2>
                <p className="text-blue-100 mb-4">
                  Connect with your community to give and receive help. Browse requests below or post your own.
                </p>
                <div className="flex space-x-4">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setCurrentView('create-request')}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        Post a Request
                      </button>
                      <button
                        onClick={() => setCurrentView('map')}
                        className="border border-blue-300 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Map
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                      >
                        Join Community
                      </button>
                      <button
                        onClick={() => setCurrentView('map')}
                        className="border border-blue-300 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        View Map
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Request Feed */}
            <div className="space-y-6">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">
                    {searchTerm || Object.keys(filters).length > 0
                      ? 'No requests match your search criteria.'
                      : 'No help requests available right now.'}
                  </p>
                  {(searchTerm || Object.keys(filters).length > 0) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilters({});
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                filteredRequests.map(request => (
                  <HelpRequestCard
                    key={request.id}
                    request={request}
                    onOfferHelp={handleOfferHelp}
                    onViewDetails={handleViewDetails}
                    currentUserId={user?.id || ''}
                  />
                ))
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        unreadNotifications={3}
      />
      <main>
        {renderContent()}
      </main>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { Building2, Link, Store, Trash2, Loader2, Globe } from 'lucide-react';
import { storageService } from '../utils/storage';
import type { Location, BusinessSettings } from '../utils/storage';

const platforms = [
  { name: 'Shopify', status: 'Connected' },
  { name: 'WooCommerce', status: 'Not Connected' },
  { name: 'Square', status: 'Connected' },
  { name: 'Yelp', status: 'Not Connected' },
  { name: 'Google My Business', status: 'Connected' }
].map(platform => ({
  ...platform,
  description: `Connect your ${platform.name} account to sync reviews and customer data`,
  icon: platform.name === 'Google My Business' ? 'https://www.google.com/favicon.ico' : undefined
}));

const generateLocationId = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState('locations');
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState<Partial<Location>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(
    storageService.getBusinessSettings()
  );
  const [gmbLink, setGmbLink] = useState(businessSettings.gmbReviewLink || '');

  const fetchLocations = () => {
    try {
      const storedLocations = storageService.getLocations();
      setLocations(storedLocations);
    } catch (err) {
      setError('Failed to load locations');
      console.error('Error loading locations:', err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name || !newLocation.streetAddress || !newLocation.city || !newLocation.state || !newLocation.zip) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const location: Location = {
        id: crypto.randomUUID(),
        locationId: generateLocationId(),
        name: newLocation.name,
        streetAddress: newLocation.streetAddress,
        city: newLocation.city,
        state: newLocation.state,
        zip: newLocation.zip,
        phone: newLocation.phone || '',
        hours: newLocation.hours || '',
        website: newLocation.website || ''
      };

      const updatedLocations = [...locations, location];
      storageService.saveLocations(updatedLocations);
      setLocations(updatedLocations);
      setShowAddLocation(false);
      setNewLocation({});
    } catch (err) {
      setError('Failed to add location');
      console.error('Error adding location:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocation = (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedLocations = locations.filter(location => location.id !== id);
      storageService.saveLocations(updatedLocations);
      setLocations(updatedLocations);
    } catch (err) {
      setError('Failed to delete location');
      console.error('Error deleting location:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGMBLink = () => {
    try {
      const settings: BusinessSettings = {
        ...businessSettings,
        gmbReviewLink: gmbLink,
        lastUpdated: new Date().toISOString(),
      };
      storageService.saveBusinessSettings(settings);
      setBusinessSettings(settings);
      setError(null);
    } catch (err) {
      setError('Failed to save Google My Business link');
      console.error('Error saving GMB link:', err);
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your store settings and preferences</p>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveSection('locations')}
              className={`px-6 py-4 font-medium border-b-2 ${
                activeSection === 'locations'
                  ? 'border-[#336633] text-[#336633]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Store Locations
              </div>
            </button>
            <button
              onClick={() => setActiveSection('integrations')}
              className={`px-6 py-4 font-medium border-b-2 ${
                activeSection === 'integrations'
                  ? 'border-[#336633] text-[#336633]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Integrations
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeSection === 'locations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Store Locations</h2>
                <button
                  onClick={() => setShowAddLocation(true)}
                  className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    'Add Location'
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locations.map((location) => (
                  <div key={location.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#336633]/10 rounded-lg">
                          <Building2 className="w-5 h-5 text-[#336633]" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{location.name}</h3>
                          <p className="text-sm text-gray-500">
                            {location.streetAddress}, {location.city}, {location.state} {location.zip}
                          </p>
                          {location.phone && (
                            <p className="text-sm text-gray-500">{location.phone}</p>
                          )}
                          {location.website && (
                            <a href={location.website} target="_blank" rel="noopener noreferrer" 
                               className="text-sm text-[#336633] hover:underline">
                              {location.website}
                            </a>
                          )}
                          <p className="text-xs text-[#336633] mt-1">Location ID: {location.locationId}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteLocation(location.id)}
                        className="text-red-500 hover:text-red-600 p-2"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="space-y-6">
              <div className="mb-8 p-6 border rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#336633]/10 rounded-lg">
                    <Globe className="w-5 h-5 text-[#336633]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Google My Business Review Link</h3>
                    <p className="text-sm text-gray-500">Set your Google My Business review link for customer feedback</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <input
                    type="url"
                    value={gmbLink}
                    onChange={(e) => setGmbLink(e.target.value)}
                    placeholder="https://g.page/r/..."
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <button
                    onClick={handleSaveGMBLink}
                    className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90"
                  >
                    Save Link
                  </button>
                </div>
                {businessSettings.lastUpdated && (
                  <p className="text-xs text-gray-500 mt-2">
                    Last updated: {new Date(businessSettings.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>

              <h2 className="text-xl font-semibold">Connected Platforms</h2>
              <div className="space-y-4">
                {platforms.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {platform.icon && (
                        <img src={platform.icon} alt={platform.name} className="w-5 h-5" />
                      )}
                      <div>
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-sm text-gray-500">{platform.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          platform.status === 'Connected'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {platform.status}
                      </span>
                      <button
                        className={`px-4 py-1 rounded-lg text-sm font-medium ${
                          platform.status === 'Connected'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-[#336633] hover:bg-[#336633]/10'
                        }`}
                      >
                        {platform.status === 'Connected' ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
            <form onSubmit={handleAddLocation}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={newLocation.name || ''}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={newLocation.streetAddress || ''}
                    onChange={(e) => setNewLocation({ ...newLocation, streetAddress: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={newLocation.city || ''}
                      onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={newLocation.state || ''}
                      onChange={(e) => setNewLocation({ ...newLocation, state: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                      maxLength={2}
                      placeholder="TX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP
                    </label>
                    <input
                      type="text"
                      value={newLocation.zip || ''}
                      onChange={(e) => setNewLocation({ ...newLocation, zip: e.target.value })}
                      className="w-full p-2 border rounded-lg"
                      required
                      maxLength={5}
                      placeholder="78701"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newLocation.phone || ''}
                    onChange={(e) => setNewLocation({ ...newLocation, phone: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="(555) 555-5555"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={newLocation.website || ''}
                    onChange={(e) => setNewLocation({ ...newLocation, website: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddLocation(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Add Location'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
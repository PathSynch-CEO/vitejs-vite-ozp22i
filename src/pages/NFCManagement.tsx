import React, { useState } from 'react';
import { Plus, Search, Filter, Tag, MapPin, Megaphone, Link, Loader2, QrCode, Smartphone, Copy, Check, AlertCircle } from 'lucide-react';
import bitlyService from '../utils/bitly';
import { generateNFCConfig, type NFCCardConfig } from '../utils/nfc';
import { storageService } from '../utils/storage';

interface NFCCard extends NFCCardConfig {
  id: string;
  status: 'active' | 'inactive';
  lastUsed: string;
  interactions: number;
  cardId?: string;
}

export default function NFCManagement() {
  const [cards, setCards] = useState<NFCCard[]>(storageService.getNFCCards());
  const [showAddCard, setShowAddCard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations] = useState(storageService.getLocations());
  const [newCard, setNewCard] = useState({
    locationId: '',
    cardId: '',
    campaignId: '',
  });
  const [shortenedUrl, setShortenedUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const businessSettings = storageService.getBusinessSettings();
      if (!businessSettings.gmbReviewLink) {
        throw new Error('Please set up your Google My Business review link in Settings first');
      }

      // Create base URL from GMB link with additional parameters
      const baseUrl = businessSettings.gmbReviewLink.replace(/\/$/, ''); // Remove trailing slash if present
      const longUrl = `${baseUrl}/?location=${newCard.locationId}${newCard.campaignId ? `&campaign=${newCard.campaignId}` : ''}`;
      
      // Get shortened URL from Bitly (or use original if Bitly fails)
      const shortUrl = await bitlyService.shortenUrl(longUrl);

      // Create new card with URL (shortened or original)
      const card: NFCCard = {
        ...generateNFCConfig(
          'merchant-123',
          newCard.locationId,
          newCard.campaignId || undefined,
          businessSettings.gmbReviewLink
        ),
        id: crypto.randomUUID(),
        status: 'active',
        lastUsed: '-',
        interactions: 0,
        shortenedUrl: shortUrl,
        cardId: newCard.cardId,
      };

      const updatedCards = [card, ...cards];
      storageService.saveNFCCards(updatedCards);
      setCards(updatedCards);
      setShortenedUrl(shortUrl);
      setShowAddCard(false);
      setNewCard({ locationId: '', cardId: '', campaignId: '' });
    } catch (error) {
      console.error('Error creating NFC card:', error);
      setError(error instanceof Error ? error.message : 'Failed to create NFC card');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">NFC Cards</h1>
          <p className="text-gray-600 mt-1">Manage your NFC cards and track their performance</p>
        </div>
        <button
          onClick={() => setShowAddCard(true)}
          className="bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Card
        </button>
      </header>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cards..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Card ID</th>
                <th className="text-left py-3 px-4">Location</th>
                <th className="text-left py-3 px-4">Campaign</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Last Used</th>
                <th className="text-left py-3 px-4">Interactions</th>
                <th className="text-left py-3 px-4">URL</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((card) => (
                <tr key={card.id} className="border-b">
                  <td className="py-3 px-4">{card.cardId || card.uid.substring(0, 8)}</td>
                  <td className="py-3 px-4">
                    {locations.find(l => l.locationId === card.locationId)?.name || '-'}
                  </td>
                  <td className="py-3 px-4">{card.campaignId || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${card.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {card.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{card.lastUsed}</td>
                  <td className="py-3 px-4">{card.interactions}</td>
                  <td className="py-3 px-4">
                    <a href={card.shortenedUrl} target="_blank" rel="noopener noreferrer" 
                       className="text-[#336633] hover:underline">
                      {card.shortenedUrl}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => copyToClipboard(card.shortenedUrl || '')}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Copy URL
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Card</h2>
            <form onSubmit={handleAddCard}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCard.cardId}
                    onChange={(e) => setNewCard({ ...newCard, cardId: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter custom card ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={newCard.locationId}
                    onChange={(e) => setNewCard({ ...newCard, locationId: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    required
                  >
                    <option value="">Select a location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.locationId}>
                        {location.name} ({location.locationId})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Campaign ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCard.campaignId}
                    onChange={(e) => setNewCard({ ...newCard, campaignId: e.target.value })}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Enter campaign ID"
                  />
                </div>
                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#FFE816] text-[#336633] px-4 py-2 rounded-lg font-medium hover:bg-[#FFE816]/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Card'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {shortenedUrl && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md animate-slide-up">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">NFC Card Created!</h3>
              <p className="text-sm text-gray-600 mt-1">Your URL:</p>
              <div className="flex items-center gap-2 mt-2">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1">
                  {shortenedUrl}
                </code>
                <button
                  onClick={() => copyToClipboard(shortenedUrl)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
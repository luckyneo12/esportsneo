'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tournamentApi } from '@/lib/api';
import { CreateTournamentForm, GameType, TournamentStatus, MapType } from '@/lib/types';

const MAPS: MapType[] = ['Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Livik', 'Karakin'];

export default function CreateTournamentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<CreateTournamentForm>({
    title: '',
    game: 'BGMI',
    mapPool: [],
    description: '',
    rules: '',
    status: 'upcoming',
    maxTeams: 16,
    entryFee: 0,
    prizePool: '',
    dateTime: '',
    allowedTowerIds: [],
  });

  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'maxTeams' || name === 'entryFee' ? Number(value) : value }));
  };

  const handleMapToggle = (map: MapType) => {
    setFormData((prev) => ({
      ...prev,
      mapPool: prev.mapPool.includes(map)
        ? prev.mapPool.filter((m) => m !== map)
        : [...prev.mapPool, map],
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [type]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'banner') {
          setBannerPreview(reader.result as string);
        } else {
          setLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.mapPool.length === 0) {
      setError('Please select at least one map');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await tournamentApi.create(formData);
      
      if (response.success) {
        router.push('/tournaments');
      } else {
        setError(response.error || 'Failed to create tournament');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2">Create Tournament</h1>
          <p className="text-gray-400">Create a new esports tournament (Organizer Only)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Tournament Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              placeholder="Enter tournament title"
            />
          </div>

          {/* Game Selection */}
          <div>
            <label htmlFor="game" className="block text-sm font-medium mb-2">
              Game *
            </label>
            <select
              id="game"
              name="game"
              value={formData.game}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
            >
              <option value="BGMI">BGMI</option>
              <option value="FF">Free Fire</option>
              <option value="VALORANT">Valorant</option>
              <option value="COD">Call of Duty</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Map Pool (for BGMI) */}
          {formData.game === 'BGMI' && (
            <div>
              <label className="block text-sm font-medium mb-3">
                Map Pool * (Select maps for tournament)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MAPS.map((map) => (
                  <button
                    key={map}
                    type="button"
                    onClick={() => handleMapToggle(map)}
                    className={`px-4 py-3 rounded-lg font-medium transition ${
                      formData.mapPool.includes(map)
                        ? 'bg-[#FF1A1A] text-white'
                        : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#2A2A2A] border border-gray-700'
                    }`}
                  >
                    {map}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div>
            <label htmlFor="dateTime" className="block text-sm font-medium mb-2">
              Tournament Date & Time *
            </label>
            <input
              type="datetime-local"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
            />
          </div>

          {/* Max Teams */}
          <div>
            <label htmlFor="maxTeams" className="block text-sm font-medium mb-2">
              Maximum Teams *
            </label>
            <input
              type="number"
              id="maxTeams"
              name="maxTeams"
              value={formData.maxTeams}
              onChange={handleInputChange}
              required
              min="2"
              max="100"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
            />
          </div>

          {/* Entry Fee */}
          <div>
            <label htmlFor="entryFee" className="block text-sm font-medium mb-2">
              Entry Fee (₹) - Optional
            </label>
            <input
              type="number"
              id="entryFee"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              placeholder="0 for free tournament"
            />
          </div>

          {/* Prize Pool */}
          <div>
            <label htmlFor="prizePool" className="block text-sm font-medium mb-2">
              Prize Pool - Optional
            </label>
            <input
              type="text"
              id="prizePool"
              name="prizePool"
              value={formData.prizePool}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              placeholder="e.g., 1st: ₹5000, 2nd: ₹3000, 3rd: ₹2000"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition resize-none"
              placeholder="Enter tournament description..."
            />
          </div>

          {/* Rules & Regulations */}
          <div>
            <label htmlFor="rules" className="block text-sm font-medium mb-2">
              Rules & Regulations
            </label>
            <textarea
              id="rules"
              name="rules"
              value={formData.rules}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition resize-none"
              placeholder="Enter tournament rules and regulations..."
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Banner Upload */}
          <div>
            <label htmlFor="banner" className="block text-sm font-medium mb-2">
              Tournament Banner
            </label>
            <input
              type="file"
              id="banner"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'banner')}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FF1A1A] file:text-white file:cursor-pointer hover:file:bg-[#FF4D4D]"
            />
            {bannerPreview && (
              <div className="mt-4">
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-700"
                />
              </div>
            )}
          </div>

          {/* Logo Upload */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium mb-2">
              Tournament Logo
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'logo')}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FF1A1A] file:text-white file:cursor-pointer hover:file:bg-[#FF4D4D]"
            />
            {logoPreview && (
              <div className="mt-4">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-700"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Tournament'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

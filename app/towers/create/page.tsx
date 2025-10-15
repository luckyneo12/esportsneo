'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { towerApi } from '@/lib/api';
import { getStates, getCitiesByState, formatLocation } from '@/lib/locations';
import { Castle, MapPin } from 'lucide-react';

export default function CreateTowerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxTeams, setMaxTeams] = useState(10);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  
  // Location fields
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const states = getStates();

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCity('');
    setAvailableCities(getCitiesByState(state));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!selectedState || !selectedCity) {
      setError('Please select state and city');
      setLoading(false);
      return;
    }

    try {
      const location = formatLocation(selectedCity, selectedState);
      
      const towerData = { 
        name, 
        description,
        logo: logo || undefined, 
        maxTeams,
        area: location, // "City, State" format
      };
      
      console.log('=== Creating Tower ===');
      console.log('Tower Data:', towerData);
      console.log('Tower Name:', name);
      console.log('Location:', location);
      
      const response = await towerApi.create(towerData);
      
      console.log('=== Create Tower Response ===');
      console.log('Success:', response.success);
      console.log('Data:', response.data);
      console.log('Error:', response.error);
      console.log('Full Response:', response);
      
      if (response.success && response.data) {
        console.log('✅ Tower created successfully!');
        console.log('Redirecting to:', `/towers/${response.data.id}`);
        router.push(`/towers/${response.data.id}`);
      } else {
        // Show exact error from backend
        const errorMessage = response.error || 'Failed to create tower';
        console.error('❌ Tower creation failed:', errorMessage);
        console.error('Full error response:', response);
        setError(errorMessage);
      }
    } catch (err: any) {
      // Handle network errors or unexpected errors
      console.error('❌ Exception during tower creation:', err);
      console.error('Error type:', typeof err);
      console.error('Error message:', err.message);
      console.error('Full error:', err);
      
      const errorMessage = err.message || 'Network error. Please check your connection and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF1A1A]/10 rounded-full mb-4">
            <Castle className="w-10 h-10 text-[#FF1A1A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2">Create Your Tower</h1>
          <p className="text-gray-400">
            Create a tower to organize and manage your esports teams
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1A1A1A] rounded-lg p-8 border border-gray-800">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Tower Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              placeholder="Enter your tower name"
            />
            <p className="mt-2 text-sm text-gray-500">
              Choose a unique name for your tower (3-50 characters)
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition resize-none"
              placeholder="Tell others about your tower..."
            />
            <p className="mt-2 text-sm text-gray-500">
              Brief description of your tower (max 200 characters)
            </p>
          </div>

          {/* Location Selection - BGMI Style */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FF1A1A]" />
              Location *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* State Dropdown */}
              <div>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  required
                  disabled={!selectedState}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select City</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Select your state first, then choose your city
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="maxTeams" className="block text-sm font-medium mb-2">
              Maximum Teams Allowed *
            </label>
            <input
              type="number"
              id="maxTeams"
              value={maxTeams}
              onChange={(e) => setMaxTeams(Number(e.target.value))}
              required
              min={1}
              max={50}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
            />
            <p className="mt-2 text-sm text-gray-500">
              Set a limit for teams in your tower (1-50)
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="logo" className="block text-sm font-medium mb-2">
              Tower Logo (Optional)
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FF1A1A] file:text-white file:cursor-pointer hover:file:bg-[#FF4D4D]"
            />
            {logoPreview && (
              <div className="mt-4">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-[#FF1A1A]"
                />
              </div>
            )}
          </div>

          <div className="bg-[#0D0D0D] rounded-lg p-4 mb-6 border border-gray-800">
            <h3 className="font-semibold mb-2 text-[#FF1A1A]">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-[#FF1A1A] mt-1">✓</span>
                <span>Unique join code for players to join your tower</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF1A1A] mt-1">✓</span>
                <span>Ability to create and manage multiple teams</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF1A1A] mt-1">✓</span>
                <span>Add ONE co-leader to help manage your tower</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF1A1A] mt-1">✓</span>
                <span>Register your teams to tournaments</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Tower'}
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

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { teamApi, userApi } from '@/lib/api';
import { User } from '@/lib/types';
import { Users, Search, X } from 'lucide-react';

export default function CreateTeamPage() {
  const params = useParams();
  const router = useRouter();
  const towerId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    logo: null as File | null,
    captainId: '',
    memberIds: [] as string[],
  });

  const [logoPreview, setLogoPreview] = useState<string>('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    const response = await userApi.search(searchQuery);
    
    if (response.success && response.data) {
      setSearchResults(response.data);
    }
    setSearching(false);
  };

  const addMember = (user: User) => {
    if (!selectedMembers.find((m) => m.id === user.id)) {
      setSelectedMembers([...selectedMembers, user]);
      setFormData((prev) => ({
        ...prev,
        memberIds: [...prev.memberIds, user.id],
      }));
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMember = (userId: string) => {
    setSelectedMembers(selectedMembers.filter((m) => m.id !== userId));
    setFormData((prev) => ({
      ...prev,
      memberIds: prev.memberIds.filter((id) => id !== userId),
      captainId: prev.captainId === userId ? '' : prev.captainId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.logo) {
      setError('Team logo is required');
      return;
    }

    if (!formData.captainId) {
      setError('Please select a team captain');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await teamApi.create({
        name: formData.name,
        logo: formData.logo,
        towerId,
        captainId: formData.captainId,
        memberIds: formData.memberIds,
      });
      
      if (response.success) {
        router.push(`/towers/${towerId}`);
      } else {
        setError(response.error || 'Failed to create team');
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
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2">Create Team</h1>
          <p className="text-gray-400">Create a new team for your tower</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Team Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              placeholder="Enter team name"
            />
            <p className="mt-2 text-sm text-gray-500">
              Team name must be unique within your tower
            </p>
          </div>

          {/* Team Logo */}
          <div>
            <label htmlFor="logo" className="block text-sm font-medium mb-2">
              Team Logo * (Required)
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoChange}
              required
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#FF1A1A] file:text-white file:cursor-pointer hover:file:bg-[#FF4D4D]"
            />
            {logoPreview && (
              <div className="mt-4">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-[#FF1A1A]"
                />
              </div>
            )}
          </div>

          {/* Search and Add Members */}
          <div>
            <label className="block text-sm font-medium mb-2">Team Members</label>
            
            {/* Search Box */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), searchUsers())}
                  placeholder="Search users by name or username..."
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-gray-700 rounded-lg max-h-60 overflow-y-auto z-10">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => addMember(user)}
                        className="w-full px-4 py-3 text-left hover:bg-[#2A2A2A] transition flex items-center gap-3"
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#FF1A1A]/20 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#FF1A1A]" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={searchUsers}
                disabled={searching}
                className="px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-[#1A1A1A] rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      {member.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-[#FF1A1A]/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#FF1A1A]" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">@{member.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name="captain"
                          checked={formData.captainId === member.id}
                          onChange={() => setFormData({ ...formData, captainId: member.id })}
                          className="w-4 h-4 text-[#FF1A1A]"
                        />
                        <span className="text-gray-400">Captain</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="p-2 hover:bg-[#2A2A2A] rounded-lg transition"
                      >
                        <X className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
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
              {loading ? 'Creating...' : 'Create Team'}
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

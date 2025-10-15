'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { userApi, towerApi, teamApi } from '@/lib/api';
import { User, Tower, Team } from '@/lib/types';
import { User as UserIcon, Castle, Users, Shield, Mail, Phone, Edit } from 'lucide-react';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [towers, setTowers] = useState<Tower[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  // Check if viewing own profile
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current logged-in user
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const loggedInUserId = String(user.id || user._id || user.userId);
        setCurrentUserId(loggedInUserId);
        
        // Convert both to string for comparison
        const profileUserId = String(userId);
        const isOwn = loggedInUserId === profileUserId;
        
        setIsOwnProfile(isOwn);
        
        console.log('=== Profile Ownership Check ===');
        console.log('Logged-in User ID:', loggedInUserId);
        console.log('Profile User ID:', profileUserId);
        console.log('Is Own Profile:', isOwn);
        console.log('User Data:', user);
      } catch (error) {
        console.error('Error parsing userData:', error);
      }
    } else {
      console.log('No userData in localStorage');
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);

    try {
      console.log('Fetching profile for userId:', userId);
      
      // Fetch user profile
      const userResponse = await userApi.getProfile(userId);
      console.log('User API Response:', userResponse);
      
      if (userResponse.success && userResponse.data) {
        setUser(userResponse.data);
        console.log('User data set:', userResponse.data);
      } else {
        console.error('Failed to fetch user:', userResponse.error);
      }

      // Fetch user's towers
      const towersResponse = await towerApi.getAll(userId);
      console.log('Towers API Response:', towersResponse);
      
      if (towersResponse.success && towersResponse.data) {
        setTowers(towersResponse.data);
        console.log('Towers data set:', towersResponse.data);
      } else {
        console.error('Failed to fetch towers:', towersResponse.error);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }

    setLoading(false);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500',
      organiser: 'bg-blue-500/20 text-blue-400 border-blue-500',
      towerOwner: 'bg-green-500/20 text-green-400 border-green-500',
      player: 'bg-gray-500/20 text-gray-400 border-gray-500',
    };
    return colors[role as keyof typeof colors] || colors.player;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <UserIcon className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-[#FF1A1A]/20 to-transparent rounded-lg p-8 mb-8 border border-gray-800">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {(user.avatarUrl || user.avatar) ? (
                <img
                  src={user.avatarUrl || user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#FF1A1A]"
                />
              ) : (
                <div className="w-32 h-32 bg-[#FF1A1A]/20 rounded-full flex items-center justify-center border-4 border-[#FF1A1A]">
                  <UserIcon className="w-16 h-16 text-[#FF1A1A]" />
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute bottom-0 right-0 p-2 bg-[#FF1A1A] rounded-full hover:bg-[#FF4D4D] transition">
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-bold">{user.name}</h1>
                    {isOwnProfile && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500">
                        YOU
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-gray-400">@{user.username}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${getRoleBadge(
                    user.role
                  )}`}
                >
                  {user.role.toUpperCase()}
                </span>
              </div>

              {user.bio && (
                <p className="text-gray-300 mb-4">{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {/* Only show mobile to own profile */}
                {isOwnProfile && user.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#FF1A1A]" />
                    <span>{user.mobile}</span>
                  </div>
                )}
                {/* Only show email to own profile */}
                {isOwnProfile && user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#FF1A1A]" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.gameId && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#FF1A1A]" />
                    <span>Game ID: {user.gameId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Castle className="w-4 h-4 text-[#FF1A1A]" />
                  <span>{towers.length} Tower{towers.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {(user.matchesPlayed || user.kills || user.wins) && (
          <div className="bg-[#1A1A1A] rounded-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Player Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {user.matchesPlayed !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#FF1A1A]">{user.matchesPlayed}</p>
                  <p className="text-sm text-gray-400 mt-1">Matches</p>
                </div>
              )}
              {user.wins !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{user.wins}</p>
                  <p className="text-sm text-gray-400 mt-1">Wins</p>
                </div>
              )}
              {user.matchesWon !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-400">{user.matchesWon}</p>
                  <p className="text-sm text-gray-400 mt-1">Matches Won</p>
                </div>
              )}
              {user.kills !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400">{user.kills}</p>
                  <p className="text-sm text-gray-400 mt-1">Kills</p>
                </div>
              )}
              {user.deaths !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-400">{user.deaths}</p>
                  <p className="text-sm text-gray-400 mt-1">Deaths</p>
                </div>
              )}
              {user.kills !== undefined && user.deaths !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">
                    {user.deaths > 0 ? (user.kills / user.deaths).toFixed(2) : user.kills}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">K/D Ratio</p>
                </div>
              )}
              {user.mvpCount !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-400">{user.mvpCount}</p>
                  <p className="text-sm text-gray-400 mt-1">MVP</p>
                </div>
              )}
              {user.performancePoints !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-[#FF1A1A]">{user.performancePoints}</p>
                  <p className="text-sm text-gray-400 mt-1">Points</p>
                </div>
              )}
              {user.level !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">{user.level}</p>
                  <p className="text-sm text-gray-400 mt-1">Level</p>
                </div>
              )}
              {user.xp !== undefined && (
                <div className="text-center">
                  <p className="text-3xl font-bold text-cyan-400">{user.xp}</p>
                  <p className="text-sm text-gray-400 mt-1">XP</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Towers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Castle className="w-6 h-6 text-[#FF1A1A]" />
            Towers
          </h2>

          {towers.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-lg p-8 text-center border border-gray-800">
              <Castle className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">Not part of any tower yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {towers.map((tower) => (
                <div
                  key={tower.id}
                  className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800 hover:border-[#FF1A1A] transition"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                      <Castle className="w-6 h-6 text-[#FF1A1A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{tower.name}</h3>
                      <p className="text-sm text-gray-400">Code: {tower.code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="w-4 h-4 text-[#FF1A1A]" />
                      <span>{tower.teams?.length || 0} teams</span>
                    </div>
                    {tower.ownerId === userId && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-semibold">
                        OWNER
                      </span>
                    )}
                    {tower.coLeaderId === userId && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                        CO-LEADER
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

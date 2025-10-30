'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { towerApi, teamApi } from '@/lib/api';
import { Tower, Team, TowerMember } from '@/lib/types';
import { 
  Castle, Users, Shield, Settings, Trophy, TrendingUp, 
  Calendar, Search, Crown, BarChart3, Activity, UserPlus
} from 'lucide-react';

export default function MyTowerManagePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tower, setTower] = useState<Tower | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TowerMember[]>([]);
  
  // Filters
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'members' | 'records'>('overview');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'allTime'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User info
  const [isOwner, setIsOwner] = useState(false);
  const [isCoLeader, setIsCoLeader] = useState(false);

  useEffect(() => {
    checkAuthAndFetchTower();
  }, []);

  const checkAuthAndFetchTower = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const userDataStr = localStorage.getItem('userData');
      
      if (!token || !userDataStr) {
        router.push('/auth/login');
        return;
      }

      const userData = JSON.parse(userDataStr);
      const userId = String(userData.id || userData._id || userData.userId);

      console.log('Fetching user towers for:', userId);
      
      const towersResponse = await towerApi.getAll(userId);
      console.log('Towers Response:', towersResponse);
      
      if (towersResponse.success && towersResponse.data && towersResponse.data.length > 0) {
        const userTower = towersResponse.data[0];
        setTower(userTower);
        
        const isOwn = String(userTower.ownerId) === userId;
        const isCoLead = String(userTower.coLeaderId) === userId;
        setIsOwner(isOwn);
        setIsCoLeader(isCoLead);
        
        await fetchTeams(userTower.id);
        await fetchMembers(userTower.id);
      } else {
        router.push('/towers/create');
      }
    } catch (error) {
      console.error('Error fetching tower:', error);
      router.push('/towers');
    }
    
    setLoading(false);
  };

  const fetchTeams = async (towerId: string) => {
    try {
      const response = await teamApi.getAll(towerId);
      if (response.success && response.data) {
        setTeams(response.data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchMembers = async (towerId: string) => {
    try {
      const response = await towerApi.getMembers(towerId);
      if (response.success && response.data) {
        setMembers(response.data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const getFilteredMembers = () => {
    if (!searchQuery) return members;
    return members.filter(member => 
      member.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.user?.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredTeams = () => {
    if (!searchQuery) return teams;
    return teams.filter(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading your tower...</p>
        </div>
      </div>
    );
  }

  if (!tower) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <Castle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Tower Found</h2>
          <p className="text-gray-400 mb-6">Create your tower to get started</p>
          <Link
            href="/towers/create"
            className="px-6 py-3 bg-[#FF1A1A] rounded-lg hover:bg-[#FF4D4D] transition inline-block"
          >
            Create Tower
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF1A1A]/20 to-transparent rounded-lg p-6 mb-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {tower.logo ? (
                <img src={tower.logo} alt={tower.name} className="w-20 h-20 rounded-lg object-cover border-2 border-[#FF1A1A]" />
              ) : (
                <div className="w-20 h-20 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center border-2 border-[#FF1A1A]">
                  <Castle className="w-10 h-10 text-[#FF1A1A]" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{tower.name}</h1>
                  {isOwner && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold border border-yellow-500">
                      <Crown className="w-3 h-3 inline mr-1" />
                      OWNER
                    </span>
                  )}
                  {isCoLeader && !isOwner && (
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold border border-blue-500">
                      <Shield className="w-3 h-3 inline mr-1" />
                      CO-LEADER
                    </span>
                  )}
                </div>
                <p className="text-gray-400">{tower.description || 'No description'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Code: <span className="text-[#FF1A1A] font-mono">{tower.code}</span></span>
                  <span>•</span>
                  <span>{tower.area || 'Location not set'}</span>
                </div>
              </div>
            </div>
            
            {(isOwner || isCoLeader) && (
              <Link
                href={`/towers/${tower.id}/settings`}
                className="px-4 py-2 bg-[#1A1A1A] rounded-lg hover:bg-[#2A2A2A] transition border border-gray-800 flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-2xl font-bold">{members.length}</span>
            </div>
            <p className="text-sm text-gray-400">Total Members</p>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold">{teams.length}</span>
            </div>
            <p className="text-sm text-gray-400">Active Teams</p>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold">{tower.stats?.tournamentsWon || 0}</span>
            </div>
            <p className="text-sm text-gray-400">Tournaments Won</p>
          </div>
          
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-2xl font-bold">Lv {tower.stats?.level || 1}</span>
            </div>
            <p className="text-sm text-gray-400">Tower Level</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1A1A1A] rounded-lg p-1 mb-6 border border-gray-800 flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'overview' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex-1 px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'teams' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Teams ({teams.length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`flex-1 px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'members' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 px-4 py-3 rounded-lg transition flex items-center justify-center gap-2 ${
              activeTab === 'records' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Records
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href={`/towers/${tower.id}/teams/create`} className="p-4 bg-[#0D0D0D] rounded-lg border border-gray-800 hover:border-[#FF1A1A] transition">
                  <Shield className="w-8 h-8 text-[#FF1A1A] mb-2" />
                  <h3 className="font-semibold mb-1">Create Team</h3>
                  <p className="text-sm text-gray-400">Add a new team to your tower</p>
                </Link>
                
                <Link href={`/towers/${tower.id}/invite`} className="p-4 bg-[#0D0D0D] rounded-lg border border-gray-800 hover:border-[#FF1A1A] transition">
                  <UserPlus className="w-8 h-8 text-[#FF1A1A] mb-2" />
                  <h3 className="font-semibold mb-1">Invite Members</h3>
                  <p className="text-sm text-gray-400">Share join code with players</p>
                </Link>
                
                <Link href={`/towers/${tower.id}/tournaments`} className="p-4 bg-[#0D0D0D] rounded-lg border border-gray-800 hover:border-[#FF1A1A] transition">
                  <Trophy className="w-8 h-8 text-[#FF1A1A] mb-2" />
                  <h3 className="font-semibold mb-1">Tournaments</h3>
                  <p className="text-sm text-gray-400">Register teams for tournaments</p>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                  />
                </div>
              </div>
              
              {(isOwner || isCoLeader) && (
                <Link href={`/towers/${tower.id}/teams/create`} className="px-4 py-2 bg-[#FF1A1A] rounded-lg hover:bg-[#FF4D4D] transition flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Create Team
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getFilteredTeams().map((team) => (
                <Link key={team.id} href={`/teams/${team.id}`} className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 hover:border-[#FF1A1A] transition">
                  <div className="flex items-center gap-3 mb-3">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-lg object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-[#FF1A1A]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{team.name}</h3>
                      <p className="text-xs text-gray-400">Captain: {team.captain?.name || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{team.members?.length || 0}/5</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className={`px-2 py-1 rounded text-xs ${
                        team.status === 'free' ? 'bg-green-500/20 text-green-400' :
                        team.status === 'registered' ? 'bg-yellow-500/20 text-yellow-400' :
                        team.status === 'inTournament' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {team.status || 'Free'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {getFilteredTeams().length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No teams found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {getFilteredMembers().map((member) => (
                <Link key={member.userId} href={`/profile/${member.userId}`} className="block bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 hover:border-[#FF1A1A] transition">
                  <div className="flex items-center gap-4">
                    {member.user?.avatarUrl ? (
                      <img src={member.user.avatarUrl} alt={member.user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 bg-[#FF1A1A]/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#FF1A1A]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{member.user?.name}</p>
                      <p className="text-sm text-gray-400">@{member.user?.username}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      member.role === 'owner' ? 'bg-yellow-500/20 text-yellow-400' :
                      member.role === 'coLeader' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {member.role.toUpperCase()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {getFilteredMembers().length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No members found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Performance Records</h2>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="allTime">All Time</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Tournament Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tournaments Played</span>
                    <span className="text-xl font-bold">{tower.stats?.tournamentsPlayed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tournaments Won</span>
                    <span className="text-xl font-bold text-green-400">{tower.stats?.tournamentsWon || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-xl font-bold text-blue-400">
                      {tower.stats?.tournamentsPlayed 
                        ? Math.round((tower.stats.tournamentsWon / tower.stats.tournamentsPlayed) * 100)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Team Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Active Teams</span>
                    <span className="text-xl font-bold">{teams.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Members</span>
                    <span className="text-xl font-bold text-green-400">{members.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Tower Level</span>
                    <span className="text-xl font-bold text-blue-400">Lv {tower.stats?.level || 1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

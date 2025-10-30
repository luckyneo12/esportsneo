'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, Users, Castle, TrendingUp, Award, Star, 
  Target, Zap, Crown, Medal, Shield, Swords
} from 'lucide-react';

// Types
interface PlayerRank {
  rank: number;
  userId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  tower?: string;
  towerId?: string;
  // Stats
  matchesPlayed: number;
  wins: number;
  kills: number;
  deaths: number;
  kdRatio: number;
  mvpCount: number;
  performancePoints: number;
  level: number;
  xp: number;
  // Tournaments
  tournamentsPlayed: number;
  tournamentsWon: number;
}

interface TeamRank {
  rank: number;
  teamId: string;
  teamName: string;
  teamLogo?: string;
  tower: string;
  towerId: string;
  captain: string;
  // Stats
  matchesPlayed: number;
  wins: number;
  totalKills: number;
  performancePoints: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  winRate: number;
}

interface TowerRank {
  rank: number;
  towerId: string;
  towerName: string;
  towerLogo?: string;
  owner: string;
  location: string;
  // Stats
  totalMembers: number;
  totalTeams: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  totalPoints: number;
  level: number;
  winRate: number;
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<'players' | 'teams' | 'towers'>('players');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'allTime'>('allTime');
  const [loading, setLoading] = useState(true);

  // Sample data - Replace with API calls
  const [players, setPlayers] = useState<PlayerRank[]>([]);
  const [teams, setTeams] = useState<TeamRank[]>([]);
  const [towers, setTowers] = useState<TowerRank[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, [activeTab, timeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    
    try {
      if (activeTab === 'players') {
        const response = await fetch(
          `/api/leaderboard/players?period=${timeFilter}&limit=50`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Players leaderboard:', data);
          // Assuming API returns { leaderboard: [...] } or { data: [...] }
          const leaderboardData = data.leaderboard || data.data || data;
          setPlayers(Array.isArray(leaderboardData) ? leaderboardData : []);
        } else {
          console.error('Failed to fetch players leaderboard');
          setPlayers(generateSamplePlayers()); // Fallback to sample data
        }
      } else if (activeTab === 'teams') {
        const response = await fetch(
          `/api/leaderboard/teams?period=${timeFilter}&limit=30`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Teams leaderboard:', data);
          const leaderboardData = data.leaderboard || data.data || data;
          setTeams(Array.isArray(leaderboardData) ? leaderboardData : []);
        } else {
          console.error('Failed to fetch teams leaderboard');
          setTeams(generateSampleTeams()); // Fallback to sample data
        }
      } else {
        const response = await fetch(
          `/api/leaderboard/towers?period=${timeFilter}&limit=20`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('Towers leaderboard:', data);
          const leaderboardData = data.leaderboard || data.data || data;
          setTowers(Array.isArray(leaderboardData) ? leaderboardData : []);
        } else {
          console.error('Failed to fetch towers leaderboard');
          setTowers(generateSampleTowers()); // Fallback to sample data
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Fallback to sample data on error
      if (activeTab === 'players') {
        setPlayers(generateSamplePlayers());
      } else if (activeTab === 'teams') {
        setTeams(generateSampleTeams());
      } else {
        setTowers(generateSampleTowers());
      }
    }
    
    setLoading(false);
  };

  // Sample data generators
  const generateSamplePlayers = (): PlayerRank[] => {
    return Array.from({ length: 50 }, (_, i) => ({
      rank: i + 1,
      userId: `user-${i + 1}`,
      name: `Player ${i + 1}`,
      username: `player${i + 1}`,
      avatarUrl: undefined,
      tower: i < 10 ? 'Phoenix Esports' : undefined,
      towerId: i < 10 ? 'tower-1' : undefined,
      matchesPlayed: Math.floor(Math.random() * 100) + 50,
      wins: Math.floor(Math.random() * 50) + 10,
      kills: Math.floor(Math.random() * 500) + 100,
      deaths: Math.floor(Math.random() * 300) + 50,
      kdRatio: parseFloat((Math.random() * 3 + 1).toFixed(2)),
      mvpCount: Math.floor(Math.random() * 20),
      performancePoints: Math.floor(Math.random() * 5000) + 1000,
      level: Math.floor(Math.random() * 50) + 1,
      xp: Math.floor(Math.random() * 10000),
      tournamentsPlayed: Math.floor(Math.random() * 30) + 5,
      tournamentsWon: Math.floor(Math.random() * 10),
    }));
  };

  const generateSampleTeams = (): TeamRank[] => {
    return Array.from({ length: 30 }, (_, i) => ({
      rank: i + 1,
      teamId: `team-${i + 1}`,
      teamName: `Team ${i + 1}`,
      teamLogo: undefined,
      tower: 'Phoenix Esports',
      towerId: 'tower-1',
      captain: `Captain ${i + 1}`,
      matchesPlayed: Math.floor(Math.random() * 50) + 20,
      wins: Math.floor(Math.random() * 30) + 5,
      totalKills: Math.floor(Math.random() * 1000) + 200,
      performancePoints: Math.floor(Math.random() * 10000) + 2000,
      tournamentsPlayed: Math.floor(Math.random() * 20) + 3,
      tournamentsWon: Math.floor(Math.random() * 8),
      winRate: parseFloat((Math.random() * 50 + 30).toFixed(1)),
    }));
  };

  const generateSampleTowers = (): TowerRank[] => {
    return Array.from({ length: 20 }, (_, i) => ({
      rank: i + 1,
      towerId: `tower-${i + 1}`,
      towerName: `Tower ${i + 1}`,
      towerLogo: undefined,
      owner: `Owner ${i + 1}`,
      location: 'Mumbai, Maharashtra',
      totalMembers: Math.floor(Math.random() * 50) + 10,
      totalTeams: Math.floor(Math.random() * 10) + 2,
      tournamentsPlayed: Math.floor(Math.random() * 40) + 10,
      tournamentsWon: Math.floor(Math.random() * 15),
      totalPoints: Math.floor(Math.random() * 50000) + 10000,
      level: Math.floor(Math.random() * 20) + 1,
      winRate: parseFloat((Math.random() * 40 + 30).toFixed(1)),
    }));
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    if (rank === 2) return { icon: Medal, color: 'text-gray-300', bg: 'bg-gray-500/20' };
    if (rank === 3) return { icon: Medal, color: 'text-orange-400', bg: 'bg-orange-500/20' };
    return { icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-800' };
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF1A1A]/10 rounded-full mb-4">
            <Trophy className="w-10 h-10 text-[#FF1A1A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2">Leaderboard</h1>
          <p className="text-gray-400">Top players, teams, and towers competing for glory</p>
        </div>

        {/* Filters */}
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Category Tabs */}
            <div className="flex gap-2 bg-[#0D0D0D] rounded-lg p-1">
              <button
                onClick={() => setActiveTab('players')}
                className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                  activeTab === 'players' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                Players
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                  activeTab === 'teams' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Shield className="w-4 h-4" />
                Teams
              </button>
              <button
                onClick={() => setActiveTab('towers')}
                className={`px-6 py-2 rounded-lg transition flex items-center gap-2 ${
                  activeTab === 'towers' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Castle className="w-4 h-4" />
                Towers
              </button>
            </div>

            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="px-4 py-2 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading leaderboard...</p>
          </div>
        )}

        {/* Players Leaderboard */}
        {!loading && activeTab === 'players' && (
          <div className="space-y-3">
            {players.map((player) => {
              const badge = getRankBadge(player.rank);
              const RankIcon = badge.icon;
              
              return (
                <Link
                  key={player.userId}
                  href={`/profile/${player.userId}`}
                  className="block bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 hover:border-[#FF1A1A] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-16 h-16 ${badge.bg} rounded-lg flex flex-col items-center justify-center`}>
                      <RankIcon className={`w-6 h-6 ${badge.color}`} />
                      <span className="text-sm font-bold mt-1">#{player.rank}</span>
                    </div>

                    {/* Avatar */}
                    {player.avatarUrl ? (
                      <img
                        src={player.avatarUrl}
                        alt={player.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#FF1A1A]"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[#FF1A1A]/20 rounded-full flex items-center justify-center">
                        <Users className="w-7 h-7 text-[#FF1A1A]" />
                      </div>
                    )}

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{player.name}</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500/20 rounded-full">
                          <Star className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs text-cyan-400 font-semibold">Lv {player.level}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>@{player.username}</span>
                        {player.tower && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Castle className="w-3 h-3" />
                              <span>{player.tower}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-xl font-bold text-[#FF1A1A]">{player.performancePoints}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">{player.wins}</div>
                        <div className="text-xs text-gray-500">Wins</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-400">{player.kdRatio}</div>
                        <div className="text-xs text-gray-500">K/D</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-400">{player.tournamentsWon}</div>
                        <div className="text-xs text-gray-500">Tournaments</div>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="md:hidden flex flex-col items-end">
                      <div className="text-xl font-bold text-[#FF1A1A]">{player.performancePoints}</div>
                      <div className="text-xs text-gray-500">Points</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Teams Leaderboard */}
        {!loading && activeTab === 'teams' && (
          <div className="space-y-3">
            {teams.map((team) => {
              const badge = getRankBadge(team.rank);
              const RankIcon = badge.icon;
              
              return (
                <Link
                  key={team.teamId}
                  href={`/teams/${team.teamId}`}
                  className="block bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 hover:border-[#FF1A1A] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-16 h-16 ${badge.bg} rounded-lg flex flex-col items-center justify-center`}>
                      <RankIcon className={`w-6 h-6 ${badge.color}`} />
                      <span className="text-sm font-bold mt-1">#{team.rank}</span>
                    </div>

                    {/* Team Logo */}
                    {team.teamLogo ? (
                      <img
                        src={team.teamLogo}
                        alt={team.teamName}
                        className="w-14 h-14 rounded-lg object-cover border-2 border-[#FF1A1A]"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-7 h-7 text-[#FF1A1A]" />
                      </div>
                    )}

                    {/* Team Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold mb-1">{team.teamName}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Castle className="w-3 h-3" />
                          <span>{team.tower}</span>
                        </div>
                        <span>•</span>
                        <span>Captain: {team.captain}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-xl font-bold text-[#FF1A1A]">{team.performancePoints}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">{team.wins}</div>
                        <div className="text-xs text-gray-500">Wins</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-400">{team.winRate}%</div>
                        <div className="text-xs text-gray-500">Win Rate</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-400">{team.tournamentsWon}</div>
                        <div className="text-xs text-gray-500">Tournaments</div>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="md:hidden flex flex-col items-end">
                      <div className="text-xl font-bold text-[#FF1A1A]">{team.performancePoints}</div>
                      <div className="text-xs text-gray-500">Points</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Towers Leaderboard */}
        {!loading && activeTab === 'towers' && (
          <div className="space-y-3">
            {towers.map((tower) => {
              const badge = getRankBadge(tower.rank);
              const RankIcon = badge.icon;
              
              return (
                <Link
                  key={tower.towerId}
                  href={`/towers/${tower.towerId}`}
                  className="block bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 hover:border-[#FF1A1A] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-16 h-16 ${badge.bg} rounded-lg flex flex-col items-center justify-center`}>
                      <RankIcon className={`w-6 h-6 ${badge.color}`} />
                      <span className="text-sm font-bold mt-1">#{tower.rank}</span>
                    </div>

                    {/* Tower Logo */}
                    {tower.towerLogo ? (
                      <img
                        src={tower.towerLogo}
                        alt={tower.towerName}
                        className="w-14 h-14 rounded-lg object-cover border-2 border-[#FF1A1A]"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                        <Castle className="w-7 h-7 text-[#FF1A1A]" />
                      </div>
                    )}

                    {/* Tower Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{tower.towerName}</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-cyan-500/20 rounded-full">
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs text-cyan-400 font-semibold">Lv {tower.level}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>Owner: {tower.owner}</span>
                        <span>•</span>
                        <span>{tower.location}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="hidden md:grid grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="text-xl font-bold text-[#FF1A1A]">{tower.totalPoints}</div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">{tower.totalMembers}</div>
                        <div className="text-xs text-gray-500">Members</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-400">{tower.totalTeams}</div>
                        <div className="text-xs text-gray-500">Teams</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-purple-400">{tower.tournamentsWon}</div>
                        <div className="text-xs text-gray-500">Tournaments</div>
                      </div>
                    </div>

                    {/* Mobile Stats */}
                    <div className="md:hidden flex flex-col items-end">
                      <div className="text-xl font-bold text-[#FF1A1A]">{tower.totalPoints}</div>
                      <div className="text-xs text-gray-500">Points</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

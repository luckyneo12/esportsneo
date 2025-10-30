'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { towerApi } from '@/lib/api';
import { Tower } from '@/lib/types';
import { 
  Castle, Users, Plus, LogIn, MapPin, Grid3x3, Map, 
  Trophy, TrendingUp, Search, Filter, Award, Star
} from 'lucide-react';

export default function TowersPage() {
  const router = useRouter();
  const [towers, setTowers] = useState<Tower[]>([]);
  const [filteredTowers, setFilteredTowers] = useState<Tower[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // View mode: grid or map
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'wins' | 'level'>('name');

  // Get unique locations from towers
  const getUniqueLocations = () => {
    const locations = new Set<string>();
    towers.forEach(tower => {
      const location = tower.area || tower.location;
      if (location) {
        // Extract city from "City, State" format
        const city = location.split(',')[0].trim();
        locations.add(city);
      }
    });
    return ['All Areas', ...Array.from(locations).sort()];
  };

  const areas = getUniqueLocations();

  useEffect(() => {
    checkAuth();
    fetchTowers();
  }, []);

  useEffect(() => {
    filterAndSortTowers();
  }, [towers, searchQuery, selectedArea, sortBy]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const fetchTowers = async () => {
    setLoading(true);
    
    try {
      console.log('Fetching all towers...');
      const response = await towerApi.getAll();
      console.log('Towers API Response:', response);
      
      if (response.success && response.data) {
        setTowers(response.data);
        console.log('Towers loaded:', response.data.length);
      } else {
        console.error('Failed to fetch towers:', response.error);
        setTowers([]);
      }
    } catch (error) {
      console.error('Error fetching towers:', error);
      setTowers([]);
    }
    
    setLoading(false);
  };

  const filterAndSortTowers = () => {
    let filtered = [...towers];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(tower =>
        tower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tower.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tower.owner?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Area filter - match city from "City, State" format
    if (selectedArea !== 'all') {
      filtered = filtered.filter(tower => {
        const location = tower.area || tower.location;
        if (!location) return false;
        const city = location.split(',')[0].trim();
        return city === selectedArea;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'members':
          return (b.members?.length || 0) - (a.members?.length || 0);
        case 'wins':
          return (b.stats?.tournamentsWon || 0) - (a.stats?.tournamentsWon || 0);
        case 'level':
          return (b.stats?.level || 0) - (a.stats?.level || 0);
        default:
          return 0;
      }
    });

    setFilteredTowers(filtered);
  };

  const handleJoinTower = async () => {
    if (!joinCode.trim()) return;

    setJoining(true);
    // Get current user ID from localStorage or context
    const userId = localStorage.getItem('userId') || '';
    
    const response = await towerApi.joinWithCode(joinCode, userId);
    
    if (response.success && response.data) {
      router.push(`/towers/${response.data.id}`);
    }
    setJoining(false);
    setShowJoinModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2 flex items-center gap-3">
                <Castle className="w-10 h-10" />
                Esports Towers
              </h1>
              <p className="text-gray-400">Discover the best players and teams from your area</p>
            </div>
            {isLoggedIn && (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Join Tower
                </button>
                <Link
                  href="/towers/create"
                  className="px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Tower
                </Link>
              </div>
            )}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Castle className="w-5 h-5 text-[#FF1A1A]" />
                <span className="text-2xl font-bold">{towers.length}</span>
              </div>
              <p className="text-sm text-gray-400">Total Towers</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold">
                  {towers.reduce((sum, t) => sum + (t.members?.length || 0), 0)}
                </span>
              </div>
              <p className="text-sm text-gray-400">Total Players</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold">
                  {towers.reduce((sum, t) => sum + (t.stats?.tournamentsWon || 0), 0)}
                </span>
              </div>
              <p className="text-sm text-gray-400">Tournaments Won</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold">{areas.length - 1}</span>
              </div>
              <p className="text-sm text-gray-400">Cities</p>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 mb-6">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search towers, owners, codes..."
                    className="w-full pl-10 pr-4 py-2 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                  />
                </div>
              </div>

              {/* Area Filter */}
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="px-4 py-2 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              >
                {areas.map((area, idx) => (
                  <option key={idx} value={idx === 0 ? 'all' : area}>
                    {area}
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
              >
                <option value="name">Sort by Name</option>
                <option value="members">Sort by Members</option>
                <option value="wins">Sort by Wins</option>
                <option value="level">Sort by Level</option>
              </select>

              {/* View Toggle */}
              <div className="flex gap-2 bg-[#0D0D0D] rounded-lg p-1 border border-gray-700">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    viewMode === 'grid' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                    viewMode === 'map' ? 'bg-[#FF1A1A] text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading towers...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTowers.length === 0 && (
          <div className="text-center py-12">
            <Castle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg mb-6">
              {searchQuery || selectedArea !== 'all' ? 'No towers match your filters' : 'No towers found'}
            </p>
            {isLoggedIn && !searchQuery && selectedArea === 'all' && (
              <Link
                href="/towers/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition"
              >
                <Plus className="w-5 h-5" />
                Create Your First Tower
              </Link>
            )}
          </div>
        )}

        {/* Grid View */}
        {!loading && filteredTowers.length > 0 && viewMode === 'grid' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400">{filteredTowers.length} towers found</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTowers.map((tower) => (
                <Link
                  key={tower.id}
                  href={`/towers/${tower.id}`}
                  className="group bg-[#1A1A1A] rounded-lg p-6 border border-gray-800 hover:border-[#FF1A1A] transition"
                >
                  {/* Tower Logo/Banner */}
                  <div className="flex items-center gap-4 mb-4">
                    {tower.logo ? (
                      <img
                        src={tower.logo}
                        alt={tower.name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-[#FF1A1A]"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center group-hover:bg-[#FF1A1A]/30 transition">
                        <Castle className="w-8 h-8 text-[#FF1A1A]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold group-hover:text-[#FF1A1A] transition flex items-center gap-2">
                        {tower.name}
                        {tower.badges && tower.badges.length > 0 && (
                          <Award className="w-4 h-4 text-yellow-500" />
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{(tower as any).area || (tower as any).location || 'India'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tower Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-[#0D0D0D] rounded p-2 text-center">
                      <div className="text-lg font-bold text-blue-400">{tower.members?.length || 0}</div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                    <div className="bg-[#0D0D0D] rounded p-2 text-center">
                      <div className="text-lg font-bold text-green-400">{tower.teams?.length || 0}</div>
                      <div className="text-xs text-gray-500">Teams</div>
                    </div>
                    <div className="bg-[#0D0D0D] rounded p-2 text-center">
                      <div className="text-lg font-bold text-yellow-400">{tower.stats?.tournamentsWon || 0}</div>
                      <div className="text-xs text-gray-500">Wins</div>
                    </div>
                  </div>

                  {/* Tower Info */}
                  <div className="space-y-2 text-sm">
                    {tower.owner && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Owner:</span>
                        <span className="text-white font-semibold">{tower.owner.name}</span>
                      </div>
                    )}
                    {tower.stats?.level && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Level:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-cyan-400" />
                          <span className="text-cyan-400 font-semibold">{tower.stats.level}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                      <span className="text-gray-500">Join Code:</span>
                      <code className="text-[#FF1A1A] font-bold">{tower.code}</code>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Map View */}
        {!loading && filteredTowers.length > 0 && viewMode === 'map' && (
          <div>
            <div className="bg-[#1A1A1A] rounded-lg p-8 border border-gray-800 mb-6">
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Map className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Map View Coming Soon!</h3>
                  <p className="text-gray-400 mb-4">Interactive map to explore towers by location</p>
                  <p className="text-sm text-gray-500">For now, use area filter to find towers in your city</p>
                </div>
              </div>
            </div>

            {/* Area-wise List */}
            <div className="space-y-6">
              {areas.slice(1).map((area) => {
                const areaTowers = filteredTowers.filter(t => {
                  const location = t.area || t.location;
                  if (!location) return false;
                  const city = location.split(',')[0].trim();
                  return city === area;
                });
                
                if (areaTowers.length === 0) return null;
                
                // Get state from first tower in this area
                const firstTowerLocation = areaTowers[0].area || areaTowers[0].location || '';
                const state = firstTowerLocation.split(',')[1]?.trim() || '';
                
                return (
                  <div key={area} className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-[#FF1A1A]" />
                      <div>
                        <h3 className="text-2xl font-bold">{area}</h3>
                        {state && <p className="text-sm text-gray-400">{state}</p>}
                      </div>
                      <span className="px-3 py-1 bg-[#FF1A1A]/20 text-[#FF1A1A] rounded-full text-sm font-semibold ml-auto">
                        {areaTowers.length} {areaTowers.length === 1 ? 'Tower' : 'Towers'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {areaTowers.map((tower) => (
                        <Link
                          key={tower.id}
                          href={`/towers/${tower.id}`}
                          className="flex items-center gap-4 p-4 bg-[#0D0D0D] rounded-lg hover:bg-[#1A1A1A] border border-gray-800 hover:border-[#FF1A1A] transition"
                        >
                          {tower.logo ? (
                            <img src={tower.logo} alt={tower.name} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                              <Castle className="w-6 h-6 text-[#FF1A1A]" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-bold">{tower.name}</h4>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span>{tower.members?.length || 0} members</span>
                              <span>•</span>
                              <span>{tower.stats?.tournamentsWon || 0} wins</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Join Tower Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] rounded-lg p-8 max-w-md w-full border border-gray-800">
              <h2 className="text-2xl font-bold mb-4">Join Tower</h2>
              <p className="text-gray-400 mb-6">
                Enter the tower code to join an existing tower
              </p>
              
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter tower code"
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition mb-6 text-center text-2xl font-bold tracking-wider"
                maxLength={8}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleJoinTower}
                  disabled={joining || !joinCode.trim()}
                  className="flex-1 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joining ? 'Joining...' : 'Join Tower'}
                </button>
                <button
                  onClick={() => {
                    setShowJoinModal(false);
                    setJoinCode('');
                  }}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

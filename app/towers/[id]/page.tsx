'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { towerApi, teamApi } from '@/lib/api';
import { Tower, Team } from '@/lib/types';
import { Castle, Users, Copy, Check, Plus, Shield, Crown } from 'lucide-react';

export default function TowerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const towerId = params.id as string;

  const [tower, setTower] = useState<Tower | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTowerData();
  }, [towerId]);

  const fetchTowerData = async () => {
    setLoading(true);
    
    try {
      console.log('Fetching tower details for ID:', towerId);
      
      // Fetch tower details
      const towerResponse = await towerApi.getById(towerId);
      console.log('Tower Response:', towerResponse);
      
      if (towerResponse.success && towerResponse.data) {
        setTower(towerResponse.data);
        console.log('Tower data loaded:', towerResponse.data);
      } else {
        console.error('Failed to fetch tower:', towerResponse.error);
      }

      // Fetch teams
      console.log('Fetching teams for tower:', towerId);
      const teamsResponse = await teamApi.getAll(towerId);
      console.log('Teams Response:', teamsResponse);
      
      if (teamsResponse.success && teamsResponse.data) {
        setTeams(teamsResponse.data);
        console.log('Teams loaded:', teamsResponse.data.length);
      } else {
        console.error('Failed to fetch teams:', teamsResponse.error);
      }
    } catch (error) {
      console.error('Error fetching tower data:', error);
    }

    setLoading(false);
  };

  const copyJoinCode = () => {
    if (tower?.code) {
      navigator.clipboard.writeText(tower.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading tower...</p>
        </div>
      </div>
    );
  }

  if (!tower) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <Castle className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Tower not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF1A1A]/20 to-transparent rounded-lg p-8 mb-8 border border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                <Castle className="w-8 h-8 text-[#FF1A1A]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2">{tower.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span>Owner: {tower.owner?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#FF1A1A]" />
                    <span>{teams.length} Teams</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Join Code */}
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <p className="text-xs text-gray-400 mb-2">Join Code</p>
              <div className="flex items-center gap-2">
                <code className="text-2xl font-bold text-[#FF1A1A]">{tower.code}</code>
                <button
                  onClick={copyJoinCode}
                  className="p-2 hover:bg-[#2A2A2A] rounded-lg transition"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Co-Leader Section */}
        {tower.coLeader && (
          <div className="bg-[#1A1A1A] rounded-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#FF1A1A]" />
              Co-Leader
            </h2>
            <div className="flex items-center gap-4">
              {tower.coLeader.avatarUrl ? (
                <img
                  src={tower.coLeader.avatarUrl}
                  alt={tower.coLeader.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
              )}
              <div>
                <p className="font-semibold">{tower.coLeader.name}</p>
                <p className="text-sm text-gray-400">@{tower.coLeader.username}</p>
              </div>
            </div>
          </div>
        )}

        {/* Teams Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Teams</h2>
            <Link
              href={`/towers/${towerId}/teams/create`}
              className="px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Team
            </Link>
          </div>

          {teams.length === 0 ? (
            <div className="bg-[#1A1A1A] rounded-lg p-12 text-center border border-gray-800">
              <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg mb-4">No teams yet</p>
              <Link
                href={`/towers/${towerId}/teams/create`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition"
              >
                <Plus className="w-5 h-5" />
                Create Your First Team
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="group bg-[#1A1A1A] rounded-lg p-6 border border-gray-800 hover:border-[#FF1A1A] transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-16 h-16 rounded-lg object-cover border-2 border-[#FF1A1A]"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                        <Users className="w-8 h-8 text-[#FF1A1A]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-[#FF1A1A] transition">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {team.members?.length || 0} members
                      </p>
                    </div>
                  </div>
                  
                  {team.captain && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      <span>Captain: {team.captain.name}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Register to Tournament Button */}
        <div className="bg-gradient-to-r from-[#FF1A1A]/10 to-transparent rounded-lg p-6 border border-[#FF1A1A]/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ready to compete?</h3>
              <p className="text-gray-400">Register your teams to upcoming tournaments</p>
            </div>
            <Link
              href={`/towers/${towerId}/register`}
              className="px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition"
            >
              Register to Tournament
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

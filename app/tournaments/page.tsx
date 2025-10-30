'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { tournamentApi } from '@/lib/api';
import { Tournament } from '@/lib/types';
import { Trophy, Calendar, Users, GamepadIcon } from 'lucide-react';

export default function TournamentsPage() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  useEffect(() => {
    fetchTournaments();
  }, [filter]);

  const fetchTournaments = async () => {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    const response = await tournamentApi.getAll(params);
    
    if (response.success && response.data) {
      setTournaments(response.data.data || []);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500';
      case 'ongoing':
        return 'bg-green-500/20 text-green-400 border-green-500';
      case 'completed':
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2 flex items-center gap-3">
              <Trophy className="w-10 h-10" />
              Tournaments
            </h1>
            <p className="text-gray-400">Browse and manage esports tournaments</p>
          </div>
          <Link
            href="/tournaments/create"
            className="px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition"
          >
            Create Tournament
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-[#FF1A1A] text-white'
                  : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#2A2A2A]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading tournaments...</p>
          </div>
        )}

        {/* Tournaments Grid */}
        {!loading && tournaments.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No tournaments found</p>
          </div>
        )}

        {!loading && tournaments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/tournaments/${tournament.id}`}
                className="group bg-[#1A1A1A] rounded-lg overflow-hidden border border-gray-800 hover:border-[#FF1A1A] transition"
              >
                {/* Banner */}
                <div className="relative h-48 bg-gradient-to-br from-[#FF1A1A]/20 to-[#1A1A1A] overflow-hidden">
                  {tournament.banner ? (
                    <img
                      src={tournament.banner}
                      alt={tournament.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <GamepadIcon className="w-20 h-20 text-[#FF1A1A]/30" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {tournament.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Logo */}
                  {tournament.logo && (
                    <div className="absolute bottom-4 left-4">
                      <img
                        src={tournament.logo}
                        alt={tournament.title}
                        className="w-16 h-16 rounded-lg border-2 border-[#FF1A1A] bg-[#0D0D0D]"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF1A1A] transition">
                    {tournament.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {tournament.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <GamepadIcon className="w-4 h-4 text-[#FF1A1A]" />
                      <span>{tournament.game}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="w-4 h-4 text-[#FF1A1A]" />
                      <span>
                        {tournament.registeredTeams?.length || 0} / {tournament.maxTeams} Teams
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar className="w-4 h-4 text-[#FF1A1A]" />
                      <span>{new Date(tournament.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

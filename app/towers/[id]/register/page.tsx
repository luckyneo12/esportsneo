'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { towerApi, teamApi, tournamentApi } from '@/lib/api';
import { Tower, Team, Tournament } from '@/lib/types';
import { Trophy, Users, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegisterTeamsPage() {
  const params = useParams();
  const router = useRouter();
  const towerId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [tower, setTower] = useState<Tower | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [towerId]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch tower
    const towerResponse = await towerApi.getById(towerId);
    if (towerResponse.success && towerResponse.data) {
      setTower(towerResponse.data);
    }

    // Fetch teams
    const teamsResponse = await teamApi.getAll(towerId);
    if (teamsResponse.success && teamsResponse.data) {
      setTeams(teamsResponse.data);
    }

    // Fetch upcoming tournaments
    const tournamentsResponse = await tournamentApi.getAll({ status: 'upcoming' });
    if (tournamentsResponse.success && tournamentsResponse.data) {
      setTournaments(tournamentsResponse.data.data || []);
    }

    setLoading(false);
  };

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTournament) {
      setError('Please select a tournament');
      return;
    }

    if (selectedTeams.length === 0) {
      setError('Please select at least one team');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await towerApi.registerTeamsToTournament(towerId, {
        tournamentId: selectedTournament,
        teamIds: selectedTeams,
      });

      if (response.success) {
        setSuccess(`Successfully registered ${selectedTeams.length} team(s) to the tournament!`);
        setSelectedTeams([]);
        setTimeout(() => {
          router.push(`/towers/${towerId}`);
        }, 2000);
      } else {
        setError(response.error || 'Failed to register teams');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTournamentData = tournaments.find((t) => t.id === selectedTournament);
  const availableSlots = selectedTournamentData
    ? selectedTournamentData.maxTeams - (selectedTournamentData.registeredTeams?.length || 0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2">Register Teams to Tournament</h1>
          <p className="text-gray-400">
            Select teams from <span className="text-white font-semibold">{tower?.name}</span> to register
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <p className="text-green-500">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Select Tournament */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Select Tournament *
            </label>
            
            {tournaments.length === 0 ? (
              <div className="bg-[#1A1A1A] rounded-lg p-8 text-center border border-gray-800">
                <Trophy className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400">No upcoming tournaments available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tournaments.map((tournament) => {
                  const slots = tournament.maxTeams - (tournament.registeredTeams?.length || 0);
                  const isFull = slots <= 0;

                  return (
                    <label
                      key={tournament.id}
                      className={`block p-4 bg-[#1A1A1A] rounded-lg border-2 transition cursor-pointer ${
                        selectedTournament === tournament.id
                          ? 'border-[#FF1A1A]'
                          : 'border-gray-800 hover:border-gray-700'
                      } ${isFull ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="tournament"
                          value={tournament.id}
                          checked={selectedTournament === tournament.id}
                          onChange={(e) => setSelectedTournament(e.target.value)}
                          disabled={isFull}
                          className="mt-1 w-5 h-5 text-[#FF1A1A]"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-bold">{tournament.title}</h3>
                              <p className="text-sm text-gray-400">{tournament.game}</p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                isFull
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-green-500/20 text-green-400'
                              }`}
                            >
                              {isFull ? 'FULL' : `${slots} slots left`}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {tournament.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>
                              {tournament.registeredTeams?.length || 0} / {tournament.maxTeams} teams
                            </span>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Select Teams */}
          {selectedTournament && (
            <div>
              <label className="block text-sm font-medium mb-3">
                Select Teams to Register *
              </label>

              {teams.length === 0 ? (
                <div className="bg-[#1A1A1A] rounded-lg p-8 text-center border border-gray-800">
                  <Users className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400 mb-4">No teams in your tower yet</p>
                  <button
                    type="button"
                    onClick={() => router.push(`/towers/${towerId}/teams/create`)}
                    className="px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition"
                  >
                    Create Team
                  </button>
                </div>
              ) : (
                <>
                  {availableSlots < selectedTeams.length && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-500 text-sm">
                      ⚠️ You've selected more teams than available slots. Only {availableSlots} team(s) can be registered.
                    </div>
                  )}

                  <div className="space-y-3">
                    {teams.map((team) => (
                      <label
                        key={team.id}
                        className={`block p-4 bg-[#1A1A1A] rounded-lg border-2 transition cursor-pointer ${
                          selectedTeams.includes(team.id)
                            ? 'border-[#FF1A1A]'
                            : 'border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedTeams.includes(team.id)}
                            onChange={() => toggleTeamSelection(team.id)}
                            className="w-5 h-5 text-[#FF1A1A]"
                          />
                          {team.logo ? (
                            <img
                              src={team.logo}
                              alt={team.name}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-[#FF1A1A]"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-[#FF1A1A]/20 rounded-lg flex items-center justify-center">
                              <Users className="w-6 h-6 text-[#FF1A1A]" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold">{team.name}</h3>
                            <p className="text-sm text-gray-400">
                              {team.members?.length || 0} members
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Submit Button */}
          {selectedTournament && teams.length > 0 && (
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={submitting || selectedTeams.length === 0}
                className="flex-1 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? 'Registering...'
                  : `Register ${selectedTeams.length} Team${selectedTeams.length !== 1 ? 's' : ''}`}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

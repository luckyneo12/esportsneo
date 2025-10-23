'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy, Users, Calendar, Clock, CheckCircle, XCircle,
  Send, Eye, Edit, Trash2, Plus, AlertCircle, DollarSign
} from 'lucide-react';

export default function OrganizerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [roomDetails, setRoomDetails] = useState({ roomId: '', roomPassword: '' });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        router.push('/auth/login');
        return;
      }

      const userData = await response.json();
      
      if (userData.role !== 'ORGANISER' && userData.role !== 'SUPER_ADMIN') {
        router.push('/');
        return;
      }

      setUser(userData);
      await fetchTournaments();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/auth/login');
    }
  };

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/organizer/tournaments', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setTournaments(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Fetch tournaments error:', error);
    }
    setLoading(false);
  };

  const fetchRegistrations = async (tournamentId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tournaments/${tournamentId}/registrations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Fetch registrations error:', error);
    }
  };

  const handleViewTournament = async (tournament: any) => {
    setSelectedTournament(tournament);
    setRoomDetails({
      roomId: tournament.roomId || '',
      roomPassword: tournament.roomPassword || ''
    });
    await fetchRegistrations(tournament.id);
  };

  const handleApproveTeam = async (registrationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tournaments/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'APPROVED' })
      });

      if (response.ok) {
        await fetchRegistrations(selectedTournament.id);
        alert('Team approved successfully!');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Failed to approve team');
    }
  };

  const handleRejectTeam = async (registrationId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tournaments/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'REJECTED' })
      });

      if (response.ok) {
        await fetchRegistrations(selectedTournament.id);
        alert('Team rejected');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Failed to reject team');
    }
  };

  const handleUpdateRoomDetails = async () => {
    if (!selectedTournament) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tournaments/${selectedTournament.id}/room`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomDetails)
      });

      if (response.ok) {
        alert('Room details updated successfully!');
        await fetchTournaments();
      }
    } catch (error) {
      console.error('Update room error:', error);
      alert('Failed to update room details');
    }
  };

  const handleSendRoomDetails = async () => {
    if (!selectedTournament) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tournaments/${selectedTournament.id}/send-room-details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Room details sent to ${data.sent} approved teams!`);
      }
    } catch (error) {
      console.error('Send room details error:', error);
      alert('Failed to send room details');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading organizer dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10" />
                Organizer Dashboard
              </h1>
              <p className="text-gray-400">Welcome back, {user?.name || 'Organizer'}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
              >
                Back to Home
              </Link>
              <Link
                href="/tournaments/create"
                className="px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Tournament
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold">{tournaments.length}</span>
              </div>
              <p className="text-sm text-gray-400">Total Tournaments</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold">
                  {tournaments.filter(t => t.status === 'UPCOMING').length}
                </span>
              </div>
              <p className="text-sm text-gray-400">Upcoming</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold">
                  {tournaments.filter(t => t.status === 'LIVE').length}
                </span>
              </div>
              <p className="text-sm text-gray-400">Live</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold">
                  {tournaments.filter(t => t.status === 'COMPLETED').length}
                </span>
              </div>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tournaments List */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">My Tournaments</h2>
            
            {tournaments.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 mb-4">No tournaments yet</p>
                <Link
                  href="/tournaments/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Tournament
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {tournaments.map((tournament) => (
                  <div
                    key={tournament.id}
                    onClick={() => handleViewTournament(tournament)}
                    className={`p-4 bg-[#0D0D0D] rounded-lg border cursor-pointer transition ${
                      selectedTournament?.id === tournament.id
                        ? 'border-[#FF1A1A]'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{tournament.title}</h3>
                        <p className="text-sm text-gray-400">{tournament.game}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        tournament.status === 'UPCOMING' ? 'bg-blue-500/20 text-blue-400' :
                        tournament.status === 'LIVE' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {tournament._count?.registrations || 0}/{tournament.maxTeams}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(tournament.matchDateTime).toLocaleDateString()}
                      </span>
                      {tournament.entryFee > 0 && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ₹{tournament.entryFee}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tournament Details */}
          <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
            {selectedTournament ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedTournament.title}</h2>

                {/* Room Details */}
                <div className="mb-6 p-4 bg-[#0D0D0D] rounded-lg border border-gray-800">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#FF1A1A]" />
                    Room Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Room ID</label>
                      <input
                        type="text"
                        value={roomDetails.roomId}
                        onChange={(e) => setRoomDetails({ ...roomDetails, roomId: e.target.value })}
                        placeholder="Enter room ID"
                        className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Room Password</label>
                      <input
                        type="text"
                        value={roomDetails.roomPassword}
                        onChange={(e) => setRoomDetails({ ...roomDetails, roomPassword: e.target.value })}
                        placeholder="Enter room password"
                        className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateRoomDetails}
                        className="flex-1 px-4 py-2 bg-[#FF1A1A] text-white rounded-lg hover:bg-[#FF4D4D] transition"
                      >
                        Update Details
                      </button>
                      <button
                        onClick={handleSendRoomDetails}
                        disabled={!roomDetails.roomId || !roomDetails.roomPassword}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Send to Teams
                      </button>
                    </div>
                  </div>
                </div>

                {/* Team Registrations */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Team Registrations</h3>
                  {registrations.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 mx-auto text-gray-600 mb-2" />
                      <p className="text-gray-400">No teams registered yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {registrations.map((reg) => (
                        <div key={reg.id} className="p-3 bg-[#0D0D0D] rounded-lg border border-gray-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {reg.team?.logoUrl && (
                                <img src={reg.team.logoUrl} alt={reg.team.name} className="w-10 h-10 rounded-lg" />
                              )}
                              <div>
                                <p className="font-semibold">{reg.team?.name}</p>
                                <p className="text-sm text-gray-400">{reg.team?.tower?.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {reg.status === 'PENDING' ? (
                                <>
                                  <button
                                    onClick={() => handleApproveTeam(reg.id)}
                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleRejectTeam(reg.id)}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  reg.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {reg.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Eye className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Select a tournament to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

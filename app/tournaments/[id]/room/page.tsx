'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { tournamentApi, tournamentRoomApi } from '@/lib/api';
import { Tournament } from '@/lib/types';
import { Key, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function TournamentRoomPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sending, setSending] = useState(false);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [roomId, setRoomId] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  useEffect(() => {
    fetchTournament();
  }, [tournamentId]);

  const fetchTournament = async () => {
    setLoading(true);
    const response = await tournamentApi.getById(tournamentId);
    
    if (response.success && response.data) {
      setTournament(response.data);
      setRoomId(response.data.roomId || '');
      setRoomPassword(response.data.roomPassword || '');
    }
    setLoading(false);
  };

  const handleUpdateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await tournamentRoomApi.updateRoomDetails(tournamentId, {
        roomId,
        roomPassword,
      });

      if (response.success) {
        setSuccess('Room details updated successfully!');
        setTournament(response.data || tournament);
      } else {
        setError(response.error || 'Failed to update room details');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendToTeams = async () => {
    if (!roomId || !roomPassword) {
      setError('Please set room ID and password first');
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      const response = await tournamentRoomApi.sendRoomDetailsToTeams(tournamentId);

      if (response.success) {
        setSuccess(`Room details sent to ${response.data?.sent || 0} approved teams!`);
      } else {
        setError(response.error || 'Failed to send room details');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Tournament not found</p>
        </div>
      </div>
    );
  }

  const approvedTeamsCount = tournament.registeredTeams?.filter((t) => t.status === 'approved').length || 0;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2 flex items-center gap-3">
            <Key className="w-10 h-10" />
            Room Details
          </h1>
          <p className="text-gray-400">{tournament.title}</p>
        </div>

        {/* Tournament Info */}
        <div className="bg-[#1A1A1A] rounded-lg p-6 mb-6 border border-gray-800">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Status</p>
              <p className="font-semibold capitalize">{tournament.status}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Approved Teams</p>
              <p className="font-semibold">{approvedTeamsCount} teams</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Date & Time</p>
              <p className="font-semibold">
                {new Date(tournament.dateTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Game</p>
              <p className="font-semibold">{tournament.game}</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Room Details Form */}
        <form onSubmit={handleUpdateRoom} className="bg-[#1A1A1A] rounded-lg p-6 mb-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Set Room Details</h2>

          <div className="space-y-4">
            {/* Room ID */}
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium mb-2">
                Room ID *
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition font-mono text-lg"
                placeholder="Enter room ID"
              />
            </div>

            {/* Room Password */}
            <div>
              <label htmlFor="roomPassword" className="block text-sm font-medium mb-2">
                Room Password *
              </label>
              <input
                type="text"
                id="roomPassword"
                value={roomPassword}
                onChange={(e) => setRoomPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition font-mono text-lg"
                placeholder="Enter room password"
              />
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Updating...' : 'Update Room Details'}
            </button>
          </div>
        </form>

        {/* Send to Teams */}
        {roomId && roomPassword && (
          <div className="bg-gradient-to-r from-green-500/10 to-transparent rounded-lg p-6 border border-green-500/30">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Send className="w-6 h-6 text-green-500" />
              Send Room Details to Teams
            </h2>
            <p className="text-gray-400 mb-4">
              Send room ID and password to all {approvedTeamsCount} approved teams via notification.
            </p>
            
            {approvedTeamsCount === 0 ? (
              <div className="p-4 bg-yellow-500/10 border border-yellow-500 rounded-lg text-yellow-500 text-sm">
                No approved teams yet. Approve teams first before sending room details.
              </div>
            ) : (
              <button
                onClick={handleSendToTeams}
                disabled={sending}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {sending ? 'Sending...' : `Send to ${approvedTeamsCount} Teams`}
              </button>
            )}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-400">
              <p className="font-semibold mb-1">Notification Format:</p>
              <p className="text-blue-300">
                "Your team [TEAM NAME] has been confirmed for {tournament.title}. Room ID: {roomId || 'xxxx'}, Password: {roomPassword || 'yyyy'}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

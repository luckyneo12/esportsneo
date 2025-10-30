'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users, Castle, Trophy, Shield, UserCheck, UserX,
  TrendingUp, Activity, AlertCircle, CheckCircle, XCircle,
  Clock, Settings, Eye, Ban, Check, X
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTowers: 0,
    totalTournaments: 0,
    pendingApplications: 0,
    activeOrganizers: 0,
    blockedUsers: 0,
  });
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'users' | 'tournaments'>('overview');

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
      
      if (userData.role !== 'SUPER_ADMIN') {
        router.push('/');
        return;
      }

      setUser(userData);
      await fetchDashboardData();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/auth/login');
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const [usersRes, towersRes, tournamentsRes, applicationsRes] = await Promise.all([
        fetch('/api/admin/stats/users'),
        fetch('/api/admin/stats/towers'),
        fetch('/api/admin/stats/tournaments'),
        fetch('/api/admin/organizer/applications?status=pending')
      ]);

      const usersData = await usersRes.json().catch(() => ({ total: 0 }));
      const towersData = await towersRes.json().catch(() => ({ total: 0 }));
      const tournamentsData = await tournamentsRes.json().catch(() => ({ total: 0 }));
      const applicationsData = await applicationsRes.json().catch(() => []);

      setStats({
        totalUsers: usersData.total || 0,
        totalTowers: towersData.total || 0,
        totalTournaments: tournamentsData.total || 0,
        pendingApplications: Array.isArray(applicationsData) ? applicationsData.length : 0,
        activeOrganizers: usersData.organizers || 0,
        blockedUsers: usersData.blocked || 0,
      });

      setApplications(Array.isArray(applicationsData) ? applicationsData : []);
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    }
    setLoading(false);
  };

  const handleApplicationReview = async (applicationId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/organizer/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await fetchDashboardData();
        alert(`Application ${status.toLowerCase()} successfully!`);
      }
    } catch (error) {
      console.error('Review error:', error);
      alert('Failed to review application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading admin dashboard...</p>
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
                <Shield className="w-10 h-10" />
                Admin Dashboard
              </h1>
              <p className="text-gray-400">Welcome back, {user?.name || 'Admin'}</p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Back to Home
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-2xl font-bold">{stats.totalUsers}</span>
              </div>
              <p className="text-sm text-gray-400">Total Users</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Castle className="w-5 h-5 text-purple-400" />
                <span className="text-2xl font-bold">{stats.totalTowers}</span>
              </div>
              <p className="text-sm text-gray-400">Total Towers</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-2xl font-bold">{stats.totalTournaments}</span>
              </div>
              <p className="text-sm text-gray-400">Tournaments</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-2xl font-bold">{stats.pendingApplications}</span>
              </div>
              <p className="text-sm text-gray-400">Pending Apps</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <UserCheck className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold">{stats.activeOrganizers}</span>
              </div>
              <p className="text-sm text-gray-400">Organizers</p>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800">
              <div className="flex items-center gap-2 mb-2">
                <UserX className="w-5 h-5 text-red-400" />
                <span className="text-2xl font-bold">{stats.blockedUsers}</span>
              </div>
              <p className="text-sm text-gray-400">Blocked</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-800">
            {['overview', 'applications', 'users', 'tournaments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'text-[#FF1A1A] border-b-2 border-[#FF1A1A]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/users"
                  className="p-4 bg-[#0D0D0D] rounded-lg border border-gray-700 hover:border-[#FF1A1A] transition flex items-center gap-3"
                >
                  <Users className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">Manage Users</p>
                    <p className="text-sm text-gray-400">View and manage all users</p>
                  </div>
                </Link>

                <Link
                  href="/admin/tournaments"
                  className="p-4 bg-[#0D0D0D] rounded-lg border border-gray-700 hover:border-[#FF1A1A] transition flex items-center gap-3"
                >
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="font-semibold">Manage Tournaments</p>
                    <p className="text-sm text-gray-400">Oversee all tournaments</p>
                  </div>
                </Link>

                <Link
                  href="/admin/settings"
                  className="p-4 bg-[#0D0D0D] rounded-lg border border-gray-700 hover:border-[#FF1A1A] transition flex items-center gap-3"
                >
                  <Settings className="w-6 h-6 text-gray-400" />
                  <div>
                    <p className="font-semibold">Settings</p>
                    <p className="text-sm text-gray-400">Platform configuration</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Organizer Applications</h2>
            
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
                <p className="text-gray-400">No pending applications</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-[#0D0D0D] rounded-lg p-4 border border-gray-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{app.user?.name || 'Unknown User'}</h3>
                        <p className="text-sm text-gray-400">@{app.user?.username}</p>
                        <p className="mt-2 text-gray-300">{app.reason}</p>
                        {app.experience && (
                          <p className="mt-1 text-sm text-gray-400">Experience: {app.experience}</p>
                        )}
                        <div className="flex gap-4 mt-2 text-sm">
                          {app.youtube && (
                            <a href={app.youtube} target="_blank" className="text-red-400 hover:underline">
                              YouTube
                            </a>
                          )}
                          {app.instagram && (
                            <a href={app.instagram} target="_blank" className="text-pink-400 hover:underline">
                              Instagram
                            </a>
                          )}
                          {app.discord && (
                            <span className="text-indigo-400">{app.discord}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApplicationReview(app.id, 'APPROVED')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleApplicationReview(app.id, 'REJECTED')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <p className="text-gray-400">User management interface coming soon...</p>
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Tournament Management</h2>
            <p className="text-gray-400">Tournament management interface coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

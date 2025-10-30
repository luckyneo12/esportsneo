'use client';

import { useState, useEffect } from 'react';
import { organizerApi } from '@/lib/api';
import { OrganizerApplication, User } from '@/lib/types';
import { Shield, CheckCircle, XCircle, Clock, Users, Award } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'organizers'>('pending');
  const [applications, setApplications] = useState<OrganizerApplication[]>([]);
  const [organizers, setOrganizers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    if (activeTab === 'organizers') {
      fetchOrganizers();
    } else {
      fetchApplications(activeTab);
    }
  }, [activeTab]);

  const fetchApplications = async (status: 'pending' | 'approved' | 'rejected') => {
    setLoading(true);
    const response = await organizerApi.getAllApplications(status);
    if (response.success && response.data) {
      setApplications(response.data);
    }
    setLoading(false);
  };

  const fetchOrganizers = async () => {
    setLoading(true);
    const response = await organizerApi.getAllOrganizers();
    if (response.success && response.data) {
      setOrganizers(response.data);
    }
    setLoading(false);
  };

  const handleReview = async (applicationId: string, status: 'approved' | 'rejected') => {
    const response = await organizerApi.reviewApplication(applicationId, {
      status,
      reviewNotes: reviewNotes || undefined,
    });

    if (response.success) {
      setApplications(applications.filter((app) => app.id !== applicationId));
      setReviewingId(null);
      setReviewNotes('');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10" />
            Super Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage organizer applications and system users</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {[
            { key: 'pending', label: 'Pending', icon: Clock },
            { key: 'approved', label: 'Approved', icon: CheckCircle },
            { key: 'rejected', label: 'Rejected', icon: XCircle },
            { key: 'organizers', label: 'All Organizers', icon: Users },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#FF1A1A] text-white'
                  : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#2A2A2A]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading...</p>
          </div>
        )}

        {/* Applications List */}
        {!loading && activeTab !== 'organizers' && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="bg-[#1A1A1A] rounded-lg p-12 text-center border border-gray-800">
                <p className="text-gray-400">No {activeTab} applications</p>
              </div>
            ) : (
              applications.map((application) => (
                <div
                  key={application.id}
                  className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {application.user?.avatar ? (
                        <img
                          src={application.user.avatar}
                          alt={application.user.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-[#FF1A1A]/20 rounded-full flex items-center justify-center">
                          <Award className="w-8 h-8 text-[#FF1A1A]" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold">{application.user?.name}</h3>
                        <p className="text-sm text-gray-400">@{application.user?.username}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Applied: {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status)}
                      <span className="text-sm font-semibold capitalize">{application.status}</span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Reason:</h4>
                    <p className="text-gray-300">{application.reason}</p>
                  </div>

                  {/* Experience */}
                  {application.experience && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Experience:</h4>
                      <p className="text-gray-300">{application.experience}</p>
                    </div>
                  )}

                  {/* Social Links */}
                  {application.socialLinks && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Social Links:</h4>
                      <div className="flex flex-wrap gap-3">
                        {application.socialLinks.youtube && (
                          <a
                            href={application.socialLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:underline"
                          >
                            YouTube
                          </a>
                        )}
                        {application.socialLinks.instagram && (
                          <a
                            href={application.socialLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-pink-400 hover:underline"
                          >
                            Instagram
                          </a>
                        )}
                        {application.socialLinks.discord && (
                          <a
                            href={application.socialLinks.discord}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-400 hover:underline"
                          >
                            Discord
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Review Actions (Only for pending) */}
                  {application.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      {reviewingId === application.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder="Review notes (optional)..."
                            rows={3}
                            className="w-full px-4 py-2 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition resize-none text-sm"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleReview(application.id, 'approved')}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-5 h-5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(application.id, 'rejected')}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                            >
                              <XCircle className="w-5 h-5" />
                              Reject
                            </button>
                            <button
                              onClick={() => {
                                setReviewingId(null);
                                setReviewNotes('');
                              }}
                              className="px-4 py-2 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReviewingId(application.id)}
                          className="w-full px-4 py-2 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition"
                        >
                          Review Application
                        </button>
                      )}
                    </div>
                  )}

                  {/* Review Info (For approved/rejected) */}
                  {application.status !== 'pending' && application.reviewNotes && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Review Notes:</h4>
                      <p className="text-sm text-gray-300">{application.reviewNotes}</p>
                      {application.reviewedAt && (
                        <p className="text-xs text-gray-500 mt-2">
                          Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Organizers List */}
        {!loading && activeTab === 'organizers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizers.length === 0 ? (
              <div className="col-span-full bg-[#1A1A1A] rounded-lg p-12 text-center border border-gray-800">
                <p className="text-gray-400">No organizers found</p>
              </div>
            ) : (
              organizers.map((organizer) => (
                <div
                  key={organizer.id}
                  className="bg-[#1A1A1A] rounded-lg p-6 border border-gray-800"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {organizer.avatar ? (
                      <img
                        src={organizer.avatar}
                        alt={organizer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#FF1A1A]/20 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-[#FF1A1A]" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold">{organizer.name}</h3>
                      <p className="text-sm text-gray-400">@{organizer.username}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-400">
                    <p>Email: {organizer.email}</p>
                    <p>Mobile: {organizer.mobile}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {new Date(organizer.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

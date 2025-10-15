'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { organizerApi } from '@/lib/api';
import { ApplyOrganizerForm } from '@/lib/types';
import { Award, Youtube, Instagram, MessageCircle, AlertCircle } from 'lucide-react';

export default function ApplyOrganizerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<ApplyOrganizerForm>({
    reason: '',
    experience: '',
    youtube: '',
    instagram: '',
    discord: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await organizerApi.apply(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/profile');
        }, 3000);
      } else {
        setError(response.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
          <p className="text-gray-400 mb-6">
            Your organizer application has been submitted successfully. Super Admin will review it soon.
          </p>
          <div className="text-sm text-gray-500">
            Redirecting to profile...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF1A1A]/10 rounded-full mb-4">
            <Award className="w-10 h-10 text-[#FF1A1A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#FF1A1A] mb-2">Apply for Organizer Role</h1>
          <p className="text-gray-400">
            Become an organizer and create tournaments for the community
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-400">
              <p className="font-semibold mb-1">What you'll get as an Organizer:</p>
              <ul className="space-y-1 text-blue-300">
                <li>• Create and manage tournaments</li>
                <li>• Set room ID and passwords</li>
                <li>• Approve/reject team registrations</li>
                <li>• Confirm slots for teams</li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium mb-2">
              Why do you want to become an organizer? *
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition resize-none"
              placeholder="Tell us why you want to organize tournaments..."
            />
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="block text-sm font-medium mb-2">
              Previous Experience (Optional)
            </label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition resize-none"
              placeholder="Any previous experience organizing tournaments or events..."
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Links (Optional)</h3>
            
            {/* YouTube */}
            <div>
              <label htmlFor="youtube" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                YouTube Channel
              </label>
              <input
                type="url"
                id="youtube"
                name="youtube"
                value={formData.youtube}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>

            {/* Instagram */}
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                Instagram
              </label>
              <input
                type="url"
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                placeholder="https://instagram.com/yourprofile"
              />
            </div>

            {/* Discord */}
            <div>
              <label htmlFor="discord" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-indigo-500" />
                Discord Server
              </label>
              <input
                type="url"
                id="discord"
                name="discord"
                value={formData.discord}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] transition"
                placeholder="https://discord.gg/yourserver"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.reason.trim()}
              className="flex-1 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

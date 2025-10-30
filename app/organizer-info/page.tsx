'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Trophy, Users, Calendar, DollarSign, Star, CheckCircle,
  TrendingUp, Award, Zap, Target, Shield, Sparkles,
  ArrowRight, Youtube, Instagram, MessageCircle
} from 'lucide-react';

export default function OrganizerInfoPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    experience: '',
    youtube: '',
    instagram: '',
    discord: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const user = await response.json();
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/organizer/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Application submitted successfully! We will review it soon.');
        setShowApplicationForm(false);
        setFormData({ reason: '', experience: '', youtube: '', instagram: '', discord: '' });
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application');
    }
    setSubmitting(false);
  };

  const benefits = [
    {
      icon: Trophy,
      title: 'Organize Tournaments',
      description: 'Create and manage your own esports tournaments',
      color: 'text-yellow-400'
    },
    {
      icon: Users,
      title: 'Build Community',
      description: 'Connect with players and teams across India',
      color: 'text-blue-400'
    },
    {
      icon: DollarSign,
      title: 'Earn Revenue',
      description: 'Generate income through tournament entry fees',
      color: 'text-green-400'
    },
    {
      icon: Star,
      title: 'Gain Recognition',
      description: 'Build your reputation in the esports industry',
      color: 'text-purple-400'
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Brand',
      description: 'Promote your social media and YouTube channel',
      color: 'text-pink-400'
    },
    {
      icon: Award,
      title: 'Exclusive Badge',
      description: 'Get verified organizer badge on your profile',
      color: 'text-cyan-400'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up on EsportsNeo platform'
    },
    {
      number: '02',
      title: 'Apply for Organizer',
      description: 'Fill the application form with your details'
    },
    {
      number: '03',
      title: 'Get Approved',
      description: 'Our team will review and approve your application'
    },
    {
      number: '04',
      title: 'Start Organizing',
      description: 'Create tournaments and grow your esports career'
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#FF1A1A]/20 via-[#0D0D0D] to-purple-900/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF1A1A]/20 border border-[#FF1A1A]/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#FF1A1A]" />
              <span className="text-sm font-semibold text-[#FF1A1A]">Become an Organizer</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#FF1A1A] to-purple-400 bg-clip-text text-transparent">
              Start Your Esports
              <br />
              Organizing Career
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Join India's fastest growing esports platform. Organize tournaments, build your community, 
              and turn your passion into a career.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              {userRole === 'ORGANISER' || userRole === 'SUPER_ADMIN' ? (
                <Link
                  href="/organizer"
                  className="px-8 py-4 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : isLoggedIn ? (
                <button
                  onClick={() => setShowApplicationForm(true)}
                  className="px-8 py-4 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition flex items-center gap-2"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition flex items-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              
              <a
                href="#benefits"
                className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition border border-white/20"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div id="benefits" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Become an Organizer?</h2>
          <p className="text-xl text-gray-400">Unlock exclusive benefits and grow your esports career</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 bg-[#1A1A1A] rounded-xl border border-gray-800 hover:border-[#FF1A1A] transition group"
            >
              <benefit.icon className={`w-12 h-12 ${benefit.color} mb-4 group-hover:scale-110 transition`} />
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-[#1A1A1A] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How to Become an Organizer</h2>
            <p className="text-xl text-gray-400">Simple 4-step process to start your journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF1A1A] to-purple-600 rounded-full mb-4 text-3xl font-bold">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[#FF1A1A] to-transparent -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-[#FF1A1A] mb-2">500+</div>
            <div className="text-gray-400">Active Organizers</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-400 mb-2">10K+</div>
            <div className="text-gray-400">Tournaments Hosted</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-400 mb-2">1M+</div>
            <div className="text-gray-400">Players Reached</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-purple-400 mb-2">₹50L+</div>
            <div className="text-gray-400">Prize Money Distributed</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#FF1A1A] to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful organizers and build your esports empire today
          </p>
          {userRole === 'ORGANISER' || userRole === 'SUPER_ADMIN' ? (
            <Link
              href="/organizer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF1A1A] rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : isLoggedIn ? (
            <button
              onClick={() => setShowApplicationForm(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF1A1A] rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Apply for Organizer
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF1A1A] rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-xl p-8 max-w-2xl w-full border border-gray-800 max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-bold mb-6">Apply for Organizer Role</h2>
            
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Why do you want to become an organizer? *
                </label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Tell us about your passion for esports..."
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] min-h-[120px]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Previous Experience (Optional)
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Any previous tournament organizing experience..."
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A] min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    YouTube Channel
                  </label>
                  <input
                    type="url"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="https://youtube.com/@channel"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="https://instagram.com/username"
                    className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-indigo-500" />
                  Discord ID
                </label>
                <input
                  type="text"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  placeholder="username#1234"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-gray-700 rounded-lg focus:outline-none focus:border-[#FF1A1A]"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-[#FF1A1A] text-white rounded-lg font-semibold hover:bg-[#FF4D4D] transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

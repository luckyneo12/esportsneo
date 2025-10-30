'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Small delay to ensure localStorage is ready
    const timer = setTimeout(async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        console.log('Token:', token ? 'Found' : 'Not found');
        
        if (!token) {
          // Not authenticated, redirect to login
          console.log('Redirecting to login - no token');
          router.push('/auth/login');
          return;
        }

        // Always fetch fresh user data from API to avoid stale data
        console.log('Fetching user data from API...');
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const user = data.data || data.user || data;
            const userId = user._id || user.id || user.userId;
            
            console.log('User data from API:', user);
            
            // Store userData for future use
            localStorage.setItem('userData', JSON.stringify(user));
            
            console.log('Redirecting to profile from API:', userId);
            router.push(`/profile/${userId}`);
          } else {
            // Token invalid, redirect to login
            console.log('Invalid token, redirecting to login');
            localStorage.removeItem('token');
            router.push('/auth/login');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);
          // If API fails, redirect to login
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/auth/login');
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400">Loading profile...</p>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { towerApi } from '@/lib/api';

export default function MyTowerRedirectPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const redirectToTower = async () => {
      try {
        // Get user data from localStorage
        const token = localStorage.getItem('token');
        const userDataStr = localStorage.getItem('userData');
        
        console.log('Token:', token ? 'Found' : 'Not found');
        console.log('UserData:', userDataStr ? 'Found' : 'Not found');
        
        if (!token || !userDataStr) {
          // Not authenticated, redirect to login
          console.log('Redirecting to login - no auth data');
          router.push('/auth/login');
          return;
        }

        const userData = JSON.parse(userDataStr);
        const userId = userData.id || userData._id;
        
        console.log('User ID:', userId);
        
        if (!userId) {
          console.log('No user ID found, redirecting to login');
          router.push('/auth/login');
          return;
        }

        // Fetch user's towers
        console.log('Fetching user towers...');
        const towersResponse = await towerApi.getAll(userId);
        console.log('Towers Response:', towersResponse);
        
        if (towersResponse.success && towersResponse.data && towersResponse.data.length > 0) {
          // User has towers, redirect to management page
          console.log('Redirecting to tower management page');
          router.push('/tower/manage');
        } else {
          // User has no towers, redirect to towers list/create page
          console.log('No towers found, redirecting to towers page');
          router.push('/towers');
        }
      } catch (error) {
        console.error('Error fetching towers:', error);
        // On error, redirect to towers list
        router.push('/towers');
      }
    };

    redirectToTower();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#FF1A1A] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400">Loading your tower...</p>
      </div>
    </div>
  );
}

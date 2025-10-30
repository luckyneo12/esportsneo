import {
  Tournament,
  Tower,
  Team,
  User,
  UserStats,
  Achievement,
  TournamentTeam,
  OrganizerApplication,
  Notification,
  ApiResponse,
  PaginatedResponse,
  CreateTournamentForm,
  CreateTowerForm,
  CreateTeamForm,
  RegisterTeamToTournamentForm,
  ApplyOrganizerForm,
  UpdateRoomDetailsForm,
  ReviewOrganizerForm,
} from './types';

// Backend API base URL - now points to external backend root (no trailing /api)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://techbranzzo.com';

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const normalizedPath = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Extract error message from various possible formats
      const errorMessage = 
        data.error ||           // { error: "..." }
        data.message ||         // { message: "..." }
        data.errors?.[0] ||     // { errors: ["..."] }
        'Something went wrong';
      
      console.error('API Error:', errorMessage, 'Response:', data);
      
      return {
        success: false,
        error: errorMessage,
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('Network Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Helper for FormData uploads
async function uploadApiCall<T>(
  endpoint: string,
  formData: FormData,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const normalizedPath = endpoint.startsWith('/api/') ? endpoint : `/api${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
      method: 'POST',
      ...options,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Something went wrong',
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// ==================== TOURNAMENT APIs ====================

export const tournamentApi = {
  // Get all tournaments
  getAll: (params?: { status?: string; game?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams(params as any).toString();
    return apiCall<PaginatedResponse<Tournament>>(`/tournaments?${queryParams}`);
  },

  // Get single tournament
  getById: (id: string) => {
    return apiCall<Tournament>(`/tournaments/${id}`);
  },

  // Create tournament (admin/organiser only)
  create: async (data: CreateTournamentForm) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('game', data.game);
    formData.append('description', data.description);
    formData.append('status', data.status);
    formData.append('maxTeams', data.maxTeams.toString());
    
    if (data.banner) formData.append('banner', data.banner);
    if (data.logo) formData.append('logo', data.logo);

    return uploadApiCall<Tournament>('/tournaments', formData);
  },

  // Update tournament
  update: async (id: string, data: Partial<CreateTournamentForm>) => {
    const formData = new FormData();
    
    if (data.title) formData.append('title', data.title);
    if (data.game) formData.append('game', data.game);
    if (data.description) formData.append('description', data.description);
    if (data.status) formData.append('status', data.status);
    if (data.maxTeams) formData.append('maxTeams', data.maxTeams.toString());
    if (data.banner) formData.append('banner', data.banner);
    if (data.logo) formData.append('logo', data.logo);

    return uploadApiCall<Tournament>(`/tournaments/${id}`, formData, { method: 'PUT' });
  },

  // Delete tournament
  delete: (id: string) => {
    return apiCall<void>(`/tournaments/${id}`, { method: 'DELETE' });
  },

  // Get registered teams for a tournament
  getRegisteredTeams: (tournamentId: string) => {
    return apiCall<TournamentTeam[]>(`/tournaments/${tournamentId}/teams`);
  },

  // Approve/Reject team registration
  updateTeamStatus: (tournamentId: string, teamId: string, status: 'approved' | 'rejected') => {
    return apiCall<TournamentTeam>(`/tournaments/${tournamentId}/teams/${teamId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// ==================== TOWER APIs ====================

export const towerApi = {
  // Get all towers (or user's towers)
  getAll: (userId?: string) => {
    const query = userId ? `?userId=${userId}` : '';
    return apiCall<Tower[]>(`/api/towers${query}`);
  },

  // Get single tower (basic info)
  getById: (id: string) => {
    return apiCall<Tower>(`/api/towers/${id}`);
  },

  // Get complete tower overview (with members, teams, stats)
  getOverview: (towerId: string) => {
    return apiCall<Tower>(`/towers/${towerId}/overview`);
  },

  // Get tower members with performance data
  getMembers: (towerId: string) => {
    return apiCall<any>(`/towers/${towerId}/members`);
  },

  // Get teams with status (free/registered/inTournament)
  getTeamsStatus: (towerId: string) => {
    return apiCall<any>(`/towers/${towerId}/teams-status`);
  },

  // Get tower tournaments (ongoing/pending/past)
  getTournaments: (towerId: string, params?: { status?: 'ongoing' | 'pending' | 'past' }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall<any>(`/towers/${towerId}/tournaments${query}`);
  },

  // Get performance leaderboard (members)
  getMemberLeaderboard: (towerId: string, params?: { period?: 'week' | 'month' | 'allTime' }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall<any>(`/towers/${towerId}/leaderboard${query}`);
  },

  // Get announcements
  getAnnouncements: (towerId: string) => {
    return apiCall<any>(`/towers/${towerId}/announcements`);
  },

  // Create announcement (Owner/Co-Leader only)
  createAnnouncement: (towerId: string, data: { title: string; content: string; priority?: 'low' | 'medium' | 'high' }) => {
    return apiCall<any>(`/towers/${towerId}/announcements`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Create tower
  create: (data: CreateTowerForm) => {
    return apiCall<Tower>('/api/towers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update tower settings
  updateSettings: (towerId: string, data: { 
    name?: string; 
    logo?: string; 
    banner?: string; 
    description?: string;
    maxTeams?: number;
  }) => {
    return apiCall<Tower>(`/towers/${towerId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update tower (legacy)
  update: (id: string, data: Partial<CreateTowerForm>) => {
    return apiCall<Tower>(`/api/towers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Delete tower (Owner only)
  delete: (id: string) => {
    return apiCall<void>(`/api/towers/${id}`, { method: 'DELETE' });
  },

  // Promote member to elite
  promoteMember: (towerId: string, memberId: string) => {
    return apiCall<any>(`/towers/${towerId}/members/${memberId}/promote`, {
      method: 'POST',
    });
  },

  // Demote member to regular
  demoteMember: (towerId: string, memberId: string) => {
    return apiCall<any>(`/towers/${towerId}/members/${memberId}/demote`, {
      method: 'POST',
    });
  },

  // Remove member from tower
  removeMember: (towerId: string, memberId: string) => {
    return apiCall<void>(`/towers/${towerId}/members/${memberId}`, {
      method: 'DELETE',
    });
  },

  // Assign co-leader (Owner only)
  assignCoLeader: (towerId: string, userId: string) => {
    return apiCall<Tower>(`/towers/${towerId}/assign-coleader/${userId}`, {
      method: 'POST',
    });
  },

  // Remove co-leader (Owner only)
  removeCoLeader: (towerId: string) => {
    return apiCall<Tower>(`/towers/${towerId}/coleader`, {
      method: 'DELETE',
    });
  },

  // Add co-leader (legacy)
  addCoLeader: (towerId: string, userId: string) => {
    return apiCall<Tower>(`/towers/${towerId}/co-leaders`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Join tower with code
  joinWithCode: (code: string, userId: string) => {
    return apiCall<Tower>(`/towers/join`, {
      method: 'POST',
      body: JSON.stringify({ code, userId }),
    });
  },


  // Register teams to tournament
  registerTeamsToTournament: (towerId: string, data: RegisterTeamToTournamentForm) => {
    return apiCall<TournamentTeam[]>(`/towers/${towerId}/register-teams`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== TEAM APIs ====================

export const teamApi = {
  // Get all teams (or tower's teams)
  getAll: (towerId?: string) => {
    const query = towerId ? `?towerId=${towerId}` : '';
    return apiCall<Team[]>(`/teams${query}`);
  },

  // Get single team
  getById: (id: string) => {
    return apiCall<Team>(`/teams/${id}`);
  },

  // Create team
  create: async (data: CreateTeamForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('towerId', data.towerId);
    formData.append('captainId', data.captainId);
    formData.append('logo', data.logo);
    formData.append('memberIds', JSON.stringify(data.memberIds));

    return uploadApiCall<Team>('/teams', formData);
  },

  // Update team
  update: async (id: string, data: Partial<CreateTeamForm>) => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.captainId) formData.append('captainId', data.captainId);
    if (data.logo) formData.append('logo', data.logo);
    if (data.memberIds) formData.append('memberIds', JSON.stringify(data.memberIds));

    return uploadApiCall<Team>(`/teams/${id}`, formData, { method: 'PUT' });
  },

  // Delete team
  delete: (id: string) => {
    return apiCall<void>(`/teams/${id}`, { method: 'DELETE' });
  },

  // Add member to team
  addMember: (teamId: string, userId: string) => {
    return apiCall<Team>(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Remove member from team
  removeMember: (teamId: string, userId: string) => {
    return apiCall<Team>(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== USER APIs ====================

export const userApi = {
  // Get user profile
  getProfile: (id: string) => {
    return apiCall<User>(`/api/users/${id}`);
  },

  // Update user profile
  updateProfile: async (id: string, data: Partial<User> & { avatar?: File }) => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.username) formData.append('username', data.username);
    if (data.bio) formData.append('bio', data.bio);
    if (data.avatar) formData.append('avatar', data.avatar);

    return uploadApiCall<User>(`/api/users/${id}`, formData, { method: 'PUT' });
  },

  // Search users
  search: (query: string) => {
    return apiCall<User[]>(`/api/users/search?q=${encodeURIComponent(query)}`);
  },

  // Get user stats
  getStats: (userId: string) => {
    return apiCall<UserStats>(`/api/users/${userId}/stats`);
  },

  // Get user achievements
  getAchievements: (userId: string) => {
    return apiCall<Achievement[]>(`/api/users/${userId}/achievements`);
  },
};

// ==================== LEADERBOARD APIs ====================

export const leaderboardApi = {
  // Get players leaderboard
  getPlayers: (params?: { period?: 'week' | 'month' | 'allTime'; limit?: number }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall<any>(`/leaderboard/players${query}`);
  },

  // Get teams leaderboard
  getTeams: (params?: { period?: 'week' | 'month' | 'allTime'; limit?: number }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall<any>(`/leaderboard/teams${query}`);
  },

  // Get towers leaderboard
  getTowers: (params?: { period?: 'week' | 'month' | 'allTime'; limit?: number }) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiCall<any>(`/leaderboard/towers${query}`);
  },
};

// ==================== ORGANIZER APIs ====================

export const organizerApi = {
  // Apply for organizer role
  apply: (data: ApplyOrganizerForm) => {
    return apiCall<OrganizerApplication>('/organizer/apply', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get my application status
  getMyApplication: () => {
    return apiCall<OrganizerApplication>('/organizer/my-application');
  },

  // Get all applications (Super Admin only)
  getAllApplications: (status?: 'pending' | 'approved' | 'rejected') => {
    const query = status ? `?status=${status}` : '';
    return apiCall<OrganizerApplication[]>(`/organizer/applications${query}`);
  },

  // Review application (Super Admin only)
  reviewApplication: (applicationId: string, data: ReviewOrganizerForm) => {
    return apiCall<OrganizerApplication>(`/organizer/applications/${applicationId}/review`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Get all organizers (Super Admin only)
  getAllOrganizers: () => {
    return apiCall<User[]>('/organizer/list');
  },

  // Block/Unblock organizer (Super Admin only)
  toggleOrganizerStatus: (organizerId: string, isBlocked: boolean) => {
    return apiCall<User>(`/organizer/${organizerId}/toggle-status`, {
      method: 'PATCH',
      body: JSON.stringify({ isBlocked }),
    });
  },
};

// ==================== NOTIFICATION APIs ====================

export const notificationApi = {
  // Get user notifications
  getMyNotifications: (unreadOnly?: boolean) => {
    const query = unreadOnly ? '?unreadOnly=true' : '';
    return apiCall<Notification[]>(`/notifications${query}`);
  },

  // Mark notification as read
  markAsRead: (notificationId: string) => {
    return apiCall<Notification>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  // Mark all as read
  markAllAsRead: () => {
    return apiCall<void>('/notifications/read-all', {
      method: 'PATCH',
    });
  },

  // Delete notification
  delete: (notificationId: string) => {
    return apiCall<void>(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
};

// ==================== TOURNAMENT ROOM APIs ====================

export const tournamentRoomApi = {
  // Update room details (Organizer only)
  updateRoomDetails: (tournamentId: string, data: UpdateRoomDetailsForm) => {
    return apiCall<Tournament>(`/tournaments/${tournamentId}/room`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Send room details to all approved teams (Organizer only)
  sendRoomDetailsToTeams: (tournamentId: string) => {
    return apiCall<{ sent: number }>(`/tournaments/${tournamentId}/send-room-details`, {
      method: 'POST',
    });
  },
};

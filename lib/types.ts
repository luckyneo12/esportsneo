// User Types
export type UserRole = 'player' | 'organizer' | 'superAdmin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile?: string;
  avatar?: string; // Frontend uses 'avatar'
  avatarUrl?: string; // Backend returns 'avatarUrl'
  bio?: string;
  gameId?: string; // Player's in-game ID
  tagline?: string; // Custom motto/quote
  role: UserRole;
  isOrganizerApproved?: boolean; // For organizer approval status
  socialLinks?: {
    instagram?: string;
    youtube?: string;
    discord?: string;
  };
  // Stats fields from backend
  matchesPlayed?: number;
  matchesWon?: number;
  kills?: number;
  deaths?: number;
  wins?: number;
  mvpCount?: number;
  performancePoints?: number;
  level?: number; // Gamification level
  xp?: number; // Experience points
  createdAt: string;
  updatedAt?: string;
}

// User Stats
export interface UserStats {
  userId: string;
  matchesPlayed: number;
  wins: number;
  kills: number;
  deaths: number;
  assists: number;
  kdRatio: number; // Kill/Death ratio
  mvpCount: number; // MVP awards
  totalPoints: number; // Performance points
  tournamentsParticipated: number;
  tournamentsWon: number;
  updatedAt: string;
}

// Achievements & Badges
export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon?: string;
  category: 'tournament' | 'performance' | 'milestone' | 'special';
  earnedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: string;
}

// User Profile Extended
export interface UserProfile extends User {
  stats?: UserStats;
  achievements?: Achievement[];
  badges?: Badge[];
  currentTower?: Tower;
  currentTeam?: Team;
  towerRole?: 'owner' | 'coLeader' | 'member';
  teamRole?: 'captain' | 'player' | 'substitute';
  ongoingTournaments?: Tournament[];
  tournamentHistory?: Tournament[];
}

// Organizer Application
export interface OrganizerApplication {
  id: string;
  userId: string;
  user?: User;
  reason: string;
  experience?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    discord?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedByUser?: User;
  reviewNotes?: string;
  appliedAt: string;
  reviewedAt?: string;
}

// Tower Member Role
export type TowerMemberRole = 'owner' | 'coLeader' | 'eliteMember' | 'member';

// Tower Member
export interface TowerMember {
  id: string;
  userId: string;
  user?: User;
  towerId: string;
  role: TowerMemberRole;
  joinedAt: string;
  isOnline?: boolean;
  performancePoints?: number;
}

// Tower Stats
export interface TowerStats {
  totalMembers: number;
  totalTeams: number;
  tournamentsPlayed: number;
  tournamentsWon: number;
  totalPoints: number;
  level?: number; // Tower level based on activity
  xp?: number;
}

// Tower Announcement
export interface TowerAnnouncement {
  id: string;
  towerId: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: string;
  createdByUser?: User;
  createdAt: string;
  updatedAt?: string;
}

// Tower Types
export interface Tower {
  id: string;
  name: string;
  logo?: string;
  banner?: string; // Tower banner image
  code: string; // unique join code
  description?: string;
  area?: string; // City/Location (Mumbai, Delhi, etc.)
  location?: string; // Alternative field for location
  ownerId: string;
  owner?: User;
  coLeaderId?: string; // Only ONE co-leader allowed
  coLeader?: User;
  maxTeams: number; // Limited teams allowed (5-10)
  members?: TowerMember[]; // All tower members
  teams?: Team[];
  stats?: TowerStats;
  badges?: string[]; // Tournament win badges
  announcements?: TowerAnnouncement[];
  createdAt: string;
  updatedAt: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  logo: string;
  towerId: string;
  tower?: Tower;
  captainId: string;
  captain?: User;
  members?: User[];
  maxMembers?: number; // Team size limit (e.g., 4 or 5)
  currentTournamentId?: string; // If registered in a tournament
  status?: 'free' | 'registered' | 'inTournament'; // Team availability
  slotNumber?: number; // Tournament slot if registered
  createdAt: string;
  updatedAt?: string;
}

// Tournament Types
export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';
export type GameType = 'BGMI' | 'FF' | 'VALORANT' | 'COD' | 'OTHER';
export type MapType = 'Erangel' | 'Miramar' | 'Sanhok' | 'Vikendi' | 'Livik' | 'Karakin';

export interface Tournament {
  id: string;
  title: string;
  game: GameType;
  mapPool: MapType[]; // Maps allowed in tournament
  description: string;
  rules?: string; // Rules & Regulations
  banner?: string;
  logo?: string;
  status: TournamentStatus;
  maxTeams: number;
  entryFee?: number; // Entry fee (optional)
  prizePool?: string; // Prize pool description
  dateTime: string; // Tournament date & time
  allowedTowerIds?: string[]; // Specific towers allowed (empty = all towers)
  roomId?: string; // Room ID for tournament
  roomPassword?: string; // Room password
  createdBy: string; // Organizer ID
  createdByUser?: User;
  registeredTeams: TournamentTeam[];
  createdAt: string;
  updatedAt: string;
}

export interface TournamentTeam {
  id: string;
  tournamentId: string;
  teamId: string;
  team?: Team;
  registeredBy: string; // tower owner/co-leader user ID
  registeredByUser?: User;
  status: 'pending' | 'approved' | 'rejected';
  slotNumber?: number; // Slot number after approval
  notificationSent?: boolean; // Room ID notification sent
  registeredAt: string;
  approvedAt?: string;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'tournament_invite' | 'team_approved' | 'room_details' | 'organizer_status' | 'tower_invite' | 'general';
  title: string;
  message: string;
  data?: any; // Additional data (tournament ID, room details, etc.)
  isRead: boolean;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface CreateTournamentForm {
  title: string;
  game: GameType;
  mapPool: MapType[];
  description: string;
  rules?: string;
  banner?: File;
  logo?: File;
  status: TournamentStatus;
  maxTeams: number;
  entryFee?: number;
  prizePool?: string;
  dateTime: string;
  allowedTowerIds?: string[];
}

export interface CreateTowerForm {
  name: string;
  description?: string;
  logo?: File;
  banner?: File;
  area?: string; // "City, State" format
  location?: string;
  maxTeams: number;
}

export interface ApplyOrganizerForm {
  reason: string;
  experience?: string;
  youtube?: string;
  instagram?: string;
  discord?: string;
}

export interface CreateTeamForm {
  name: string;
  logo: File;
  towerId: string;
  captainId: string;
  memberIds: string[];
}

export interface RegisterTeamToTournamentForm {
  tournamentId: string;
  teamIds: string[];
}

export interface UpdateRoomDetailsForm {
  roomId: string;
  roomPassword: string;
}

export interface ReviewOrganizerForm {
  status: 'approved' | 'rejected';
  reviewNotes?: string;
}

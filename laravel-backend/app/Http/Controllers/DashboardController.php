<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tower;
use App\Models\Team;
use App\Models\Tournament;
use App\Models\TournamentRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class DashboardController extends Controller
{
    // Admin Dashboard - Complete Overview
    public function adminDashboard()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $dashboard = [
            // Overall Stats
            'stats' => [
                'total_users' => User::count(),
                'total_players' => User::where('role', 'PLAYER')->count(),
                'total_organizers' => User::where('role', 'ORGANISER')->count(),
                'total_towers' => Tower::count(),
                'total_teams' => Team::count(),
                'total_tournaments' => Tournament::count(),
                'active_tournaments' => Tournament::whereIn('status', ['UPCOMING', 'ONGOING'])->count(),
                'completed_tournaments' => Tournament::where('status', 'COMPLETED')->count(),
            ],

            // Recent Activity
            'recent_users' => User::orderBy('created_at', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'username', 'role', 'level', 'xp', 'created_at']),

            'recent_towers' => Tower::with('leader')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),

            'recent_tournaments' => Tournament::with('organizers')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),

            // Top Performers
            'top_players' => User::where('role', 'PLAYER')
                ->orderBy('performance_points', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'username', 'level', 'xp', 'performance_points', 'matches_played', 'matches_won']),

            'top_towers' => Tower::with('leader')
                ->orderBy('total_points', 'desc')
                ->limit(10)
                ->get(),

            'top_teams' => Team::with(['tower', 'captain'])
                ->orderBy('total_points', 'desc')
                ->limit(10)
                ->get(),

            // Tournament Activity
            'tournament_registrations' => TournamentRegistration::with(['tournament', 'team', 'createdBy'])
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get(),

            // Monthly Stats
            'monthly_stats' => [
                'new_users_this_month' => User::whereMonth('created_at', now()->month)->count(),
                'new_towers_this_month' => Tower::whereMonth('created_at', now()->month)->count(),
                'tournaments_this_month' => Tournament::whereMonth('created_at', now()->month)->count(),
            ],

            // Activity Log
            'activity_log' => $this->getRecentActivity(),
        ];

        return response()->json($dashboard);
    }

    // Organizer Activity Monitoring
    public function organizerActivity()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $organizers = User::where('role', 'ORGANISER')
            ->with(['organizedTournaments' => function($query) {
                $query->withCount('registrations');
            }])
            ->get()
            ->map(function($organizer) {
                return [
                    'id' => $organizer->id,
                    'name' => $organizer->name,
                    'username' => $organizer->username,
                    'email' => $organizer->email,
                    'total_tournaments' => $organizer->organizedTournaments->count(),
                    'upcoming_tournaments' => $organizer->organizedTournaments->where('status', 'UPCOMING')->count(),
                    'ongoing_tournaments' => $organizer->organizedTournaments->where('status', 'ONGOING')->count(),
                    'completed_tournaments' => $organizer->organizedTournaments->where('status', 'COMPLETED')->count(),
                    'total_registrations' => $organizer->organizedTournaments->sum('registrations_count'),
                    'tournaments' => $organizer->organizedTournaments,
                    'created_at' => $organizer->created_at,
                ];
            });

        return response()->json($organizers);
    }

    // Player Activity Monitoring
    public function playerActivity()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $players = User::where('role', 'PLAYER')
            ->with(['towerMemberships', 'teamMemberships', 'captainedTeams'])
            ->orderBy('performance_points', 'desc')
            ->get()
            ->map(function($player) {
                return [
                    'id' => $player->id,
                    'name' => $player->name,
                    'username' => $player->username,
                    'level' => $player->level,
                    'xp' => $player->xp,
                    'performance_points' => $player->performance_points,
                    'matches_played' => $player->matches_played,
                    'matches_won' => $player->matches_won,
                    'kills' => $player->kills,
                    'deaths' => $player->deaths,
                    'win_rate' => $player->matches_played > 0 ? round(($player->matches_won / $player->matches_played) * 100, 2) : 0,
                    'kd_ratio' => $player->deaths > 0 ? round($player->kills / $player->deaths, 2) : $player->kills,
                    'towers_count' => $player->towerMemberships->count(),
                    'teams_count' => $player->teamMemberships->count(),
                    'captain_of_teams' => $player->captainedTeams->count(),
                    'created_at' => $player->created_at,
                ];
            });

        return response()->json($players);
    }

    // Tower Management
    public function towerManagement()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $towers = Tower::with(['leader', 'coLeader', 'members', 'teams'])
            ->withCount(['members', 'teams'])
            ->orderBy('total_points', 'desc')
            ->get()
            ->map(function($tower) {
                return [
                    'id' => $tower->id,
                    'name' => $tower->name,
                    'code' => $tower->code,
                    'leader' => $tower->leader,
                    'co_leader' => $tower->coLeader,
                    'total_points' => $tower->total_points,
                    'members_count' => $tower->members_count,
                    'teams_count' => $tower->teams_count,
                    'max_teams' => $tower->max_teams,
                    'max_members' => $tower->max_members,
                    'utilization' => [
                        'members' => round(($tower->members_count / $tower->max_members) * 100, 2),
                        'teams' => round(($tower->teams_count / $tower->max_teams) * 100, 2),
                    ],
                    'created_at' => $tower->created_at,
                ];
            });

        return response()->json($towers);
    }

    // Recent Activity Log
    private function getRecentActivity()
    {
        $activities = [];

        // Recent user registrations
        $newUsers = User::orderBy('created_at', 'desc')->limit(5)->get();
        foreach ($newUsers as $user) {
            $activities[] = [
                'type' => 'user_registered',
                'message' => "{$user->name} joined as {$user->role}",
                'user' => $user->name,
                'timestamp' => $user->created_at,
            ];
        }

        // Recent tower creations
        $newTowers = Tower::with('leader')->orderBy('created_at', 'desc')->limit(5)->get();
        foreach ($newTowers as $tower) {
            $activities[] = [
                'type' => 'tower_created',
                'message' => "{$tower->leader->name} created tower '{$tower->name}'",
                'user' => $tower->leader->name,
                'timestamp' => $tower->created_at,
            ];
        }

        // Recent tournament registrations
        $registrations = TournamentRegistration::with(['team', 'tournament', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        foreach ($registrations as $reg) {
            $activities[] = [
                'type' => 'tournament_registration',
                'message' => "Team '{$reg->team->name}' registered for '{$reg->tournament->title}'",
                'user' => $reg->createdBy->name,
                'timestamp' => $reg->created_at,
            ];
        }

        // Sort by timestamp
        usort($activities, function($a, $b) {
            return $b['timestamp'] <=> $a['timestamp'];
        });

        return array_slice($activities, 0, 20);
    }

    // Search Everything
    public function globalSearch(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $query = $request->input('q', '');

        $results = [
            'users' => User::where('name', 'LIKE', "%{$query}%")
                ->orWhere('username', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get(['id', 'name', 'username', 'role', 'level']),

            'towers' => Tower::where('name', 'LIKE', "%{$query}%")
                ->orWhere('code', 'LIKE', "%{$query}%")
                ->with('leader')
                ->limit(10)
                ->get(),

            'teams' => Team::where('name', 'LIKE', "%{$query}%")
                ->with(['tower', 'captain'])
                ->limit(10)
                ->get(),

            'tournaments' => Tournament::where('title', 'LIKE', "%{$query}%")
                ->orWhere('game', 'LIKE', "%{$query}%")
                ->limit(10)
                ->get(),
        ];

        return response()->json($results);
    }
}

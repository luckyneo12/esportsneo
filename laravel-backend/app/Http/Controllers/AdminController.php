<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Tournament;
use App\Models\Tower;
use App\Models\OrganizerApplication;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminController extends Controller
{
    public function userStats()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $stats = [
            'total_users' => User::count(),
            'players' => User::where('role', 'PLAYER')->count(),
            'organizers' => User::where('role', 'ORGANISER')->count(),
            'admins' => User::where('role', 'SUPER_ADMIN')->count(),
            'recent_users' => User::orderBy('created_at', 'desc')->limit(10)->get(),
        ];

        return response()->json($stats);
    }

    public function tournamentStats()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $stats = [
            'total_tournaments' => Tournament::count(),
            'upcoming' => Tournament::where('status', 'UPCOMING')->count(),
            'ongoing' => Tournament::where('status', 'ONGOING')->count(),
            'completed' => Tournament::where('status', 'COMPLETED')->count(),
            'recent_tournaments' => Tournament::orderBy('created_at', 'desc')->limit(10)->get(),
        ];

        return response()->json($stats);
    }

    public function towerStats()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $stats = [
            'total_towers' => Tower::count(),
            'total_members' => \DB::table('tower_members')->count(),
            'recent_towers' => Tower::with('leader')->orderBy('created_at', 'desc')->limit(10)->get(),
        ];

        return response()->json($stats);
    }

    public function organizerApplications()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $applications = OrganizerApplication::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($applications);
    }

    public function updateApplicationStatus(Request $request, $id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $application = OrganizerApplication::with('user')->find($id);

        if (!$application) {
            return response()->json(['error' => 'Application not found'], 404);
        }

        if (!in_array($request->status, ['APPROVED', 'REJECTED'])) {
            return response()->json(['error' => 'Invalid status'], 400);
        }

        $application->update([
            'status' => $request->status,
            'reviewed_by' => $authUser->id,
        ]);

        // If approved, update user role
        if ($request->status == 'APPROVED') {
            $application->user->update(['role' => 'ORGANISER']);
        }

        return response()->json($application->load('user'));
    }
}

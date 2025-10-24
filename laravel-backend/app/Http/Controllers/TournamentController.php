<?php

namespace App\Http\Controllers;

use App\Models\Tournament;
use App\Models\TournamentRegistration;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class TournamentController extends Controller
{
    public function index()
    {
        $tournaments = Tournament::with('organizers')
            ->withCount(['registrations' => function($query) {
                $query->where('status', '!=', 'REJECTED');
            }])
            ->orderBy('match_date_time', 'desc')
            ->get();

        return response()->json($tournaments);
    }

    public function store(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'ORGANISER' && $authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'game' => 'required|string',
            'description' => 'nullable|string',
            'rules' => 'nullable|string',
            'max_teams' => 'required|integer|min:2',
            'entry_fee' => 'nullable|numeric|min:0',
            'prize_pool' => 'nullable|numeric|min:0',
            'match_date_time' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $tournament = Tournament::create($request->all());
        $tournament->organizers()->attach($authUser->id);

        return response()->json($tournament->load('organizers'), 201);
    }

    public function show($id)
    {
        $tournament = Tournament::with('organizers')
            ->withCount(['registrations' => function($query) {
                $query->where('status', '!=', 'REJECTED');
            }])
            ->find($id);

        if (!$tournament) {
            return response()->json(['error' => 'Tournament not found'], 404);
        }

        return response()->json($tournament);
    }

    public function update(Request $request, $id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();
        $tournament = Tournament::with('organizers')->find($id);

        if (!$tournament) {
            return response()->json(['error' => 'Tournament not found'], 404);
        }

        $isOrganizer = $tournament->organizers->contains($authUser->id);
        $isAdmin = $authUser->role == 'SUPER_ADMIN';

        if (!$isOrganizer && !$isAdmin) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'game' => 'sometimes|string',
            'description' => 'nullable|string',
            'rules' => 'nullable|string',
            'status' => 'sometimes|in:UPCOMING,ONGOING,COMPLETED,CANCELLED',
            'max_teams' => 'sometimes|integer|min:2',
            'entry_fee' => 'nullable|numeric|min:0',
            'prize_pool' => 'nullable|numeric|min:0',
            'match_date_time' => 'sometimes|date',
            'room_id' => 'nullable|string',
            'room_password' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $tournament->update($request->all());

        return response()->json($tournament->load('organizers'));
    }

    public function destroy($id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();
        $tournament = Tournament::with('organizers')->find($id);

        if (!$tournament) {
            return response()->json(['error' => 'Tournament not found'], 404);
        }

        $isOrganizer = $tournament->organizers->contains($authUser->id);
        $isAdmin = $authUser->role == 'SUPER_ADMIN';

        if (!$isOrganizer && !$isAdmin) {
            return response()->json(['error' => 'Forbidden - Only organizer or admin can delete'], 403);
        }

        $tournament->delete();

        return response()->json(['success' => true]);
    }

    public function register(Request $request, $id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'team_ids' => 'required|array',
            'team_ids.*' => 'exists:teams,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $tournament = Tournament::find($id);

        if (!$tournament) {
            return response()->json(['error' => 'Tournament not found'], 404);
        }

        // Check if tournament is full
        $currentRegistrations = $tournament->registrations()
            ->where('status', '!=', 'REJECTED')
            ->count();

        if ($currentRegistrations + count($request->team_ids) > $tournament->max_teams) {
            return response()->json(['error' => 'Tournament is full or not enough slots available'], 400);
        }

        $registeredTeams = [];

        foreach ($request->team_ids as $teamId) {
            $team = Team::with('tower')->find($teamId);

            if (!$team) continue;

            // Check if user has permission
            $isOwner = $team->tower->leader_id == $authUser->id;
            $isCoLeader = $team->tower->co_leader_id == $authUser->id;

            if (!$isOwner && !$isCoLeader) continue;

            // Check if already registered
            $existing = TournamentRegistration::where('tournament_id', $id)
                ->where('team_id', $teamId)
                ->first();

            if ($existing) continue;

            // Register team
            $registration = TournamentRegistration::create([
                'tournament_id' => $id,
                'team_id' => $teamId,
                'created_by_user_id' => $authUser->id,
                'status' => 'PENDING',
            ]);

            $registeredTeams[] = $registration;
        }

        return response()->json([
            'message' => count($registeredTeams) . ' team(s) registered successfully',
            'registeredTeams' => $registeredTeams,
        ], 201);
    }

    public function registrations($id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $registrations = TournamentRegistration::where('tournament_id', $id)
            ->with(['team.tower', 'team.captain', 'createdBy'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($registrations);
    }

    public function updateRoom(Request $request, $id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'ORGANISER' && $authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'room_id' => 'required|string',
            'room_password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $tournament = Tournament::find($id);

        if (!$tournament) {
            return response()->json(['error' => 'Tournament not found'], 404);
        }

        $tournament->update([
            'room_id' => $request->room_id,
            'room_password' => $request->room_password,
        ]);

        return response()->json($tournament);
    }
}

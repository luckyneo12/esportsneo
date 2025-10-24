<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::with(['tower', 'captain', 'members'])
            ->orderBy('total_points', 'desc')
            ->get();

        return response()->json($teams);
    }

    public function store(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'tower_id' => 'required|exists:towers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        // Check if team name already exists in this tower
        $existing = Team::where('name', $request->name)
            ->where('tower_id', $request->tower_id)
            ->first();

        if ($existing) {
            return response()->json(['error' => 'Team name already exists in this tower'], 409);
        }

        $team = Team::create([
            'name' => $request->name,
            'tower_id' => $request->tower_id,
            'captain_id' => $authUser->id,
        ]);

        // Add captain as member
        $team->members()->attach($authUser->id);

        return response()->json($team->load(['tower', 'captain', 'members']), 201);
    }

    public function show($id)
    {
        $team = Team::with(['tower', 'captain', 'members'])
            ->find($id);

        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        return response()->json($team);
    }

    public function update(Request $request, $id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();
        $team = Team::with('tower')->find($id);

        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        // Check if user is tower owner/co-leader
        if ($team->tower->leader_id != $authUser->id && $team->tower->co_leader_id != $authUser->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'captain_id' => 'sometimes|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        if ($request->has('name')) {
            // Check uniqueness
            $existing = Team::where('name', $request->name)
                ->where('tower_id', $team->tower_id)
                ->where('id', '!=', $id)
                ->first();

            if ($existing) {
                return response()->json(['error' => 'Team name already exists in this tower'], 409);
            }
        }

        $team->update($request->only(['name', 'captain_id']));

        return response()->json($team->load(['tower', 'captain']));
    }

    public function destroy($id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();
        $team = Team::with('tower')->find($id);

        if (!$team) {
            return response()->json(['error' => 'Team not found'], 404);
        }

        if ($team->tower->leader_id != $authUser->id && $team->tower->co_leader_id != $authUser->id) {
            return response()->json(['error' => 'Forbidden - Only tower owner/co-leader can delete teams'], 403);
        }

        $team->delete();

        return response()->json(['success' => true]);
    }
}

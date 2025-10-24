<?php

namespace App\Http\Controllers;

use App\Models\Tower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class TowerController extends Controller
{
    public function index()
    {
        $towers = Tower::with(['leader', 'coLeader', 'teams'])
            ->orderBy('total_points', 'desc')
            ->get();

        return response()->json($towers);
    }

    public function store(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:towers|max:255',
            'description' => 'nullable|string',
            'max_teams' => 'nullable|integer|min:1',
            'max_members' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $tower = Tower::create([
            'name' => $request->name,
            'code' => strtoupper(Str::random(6)),
            'description' => $request->description,
            'leader_id' => $authUser->id,
            'max_teams' => $request->max_teams ?? 10,
            'max_members' => $request->max_members ?? 50,
        ]);

        // Add leader as member
        $tower->members()->attach($authUser->id);

        return response()->json($tower->load(['leader', 'members']), 201);
    }

    public function show($id)
    {
        $tower = Tower::with(['leader', 'coLeader', 'members', 'teams.captain', 'teams.members'])
            ->find($id);

        if (!$tower) {
            return response()->json(['error' => 'Tower not found'], 404);
        }

        return response()->json($tower);
    }

    public function update(Request $request, $id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();
        $tower = Tower::find($id);

        if (!$tower) {
            return response()->json(['error' => 'Tower not found'], 404);
        }

        if ($tower->leader_id != $authUser->id && $tower->co_leader_id != $authUser->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|unique:towers,name,' . $id . '|max:255',
            'description' => 'nullable|string',
            'max_teams' => 'nullable|integer|min:1',
            'max_members' => 'nullable|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $tower->update($request->only(['name', 'description', 'max_teams', 'max_members']));

        return response()->json($tower->load(['leader', 'coLeader']));
    }

    public function destroy($id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();
        $tower = Tower::find($id);

        if (!$tower) {
            return response()->json(['error' => 'Tower not found'], 404);
        }

        if ($tower->leader_id != $authUser->id) {
            return response()->json(['error' => 'Forbidden - Only tower owner can delete'], 403);
        }

        $tower->delete();

        return response()->json(['success' => true]);
    }

    public function join(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $tower = Tower::where('code', $request->code)->first();

        if (!$tower) {
            return response()->json(['error' => 'Invalid tower code'], 404);
        }

        // Check if already a member
        if ($tower->members()->where('user_id', $authUser->id)->exists()) {
            return response()->json(['error' => 'Already a member'], 400);
        }

        // Check max members limit
        if ($tower->members()->count() >= $tower->max_members) {
            return response()->json(['error' => 'Tower is full'], 400);
        }

        $tower->members()->attach($authUser->id);

        return response()->json([
            'message' => 'Successfully joined tower',
            'tower' => $tower->load(['leader', 'members'])
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::with(['ledTowers', 'coLedTowers', 'towerMemberships', 'captainedTeams', 'teamMemberships'])
            ->find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->id != $id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|min:3|max:255|unique:users,username,' . $id,
            'bio' => 'nullable|string',
            'game_id' => 'nullable|string',
            'instagram_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'discord_url' => 'nullable|string',
            'custom_tagline' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $user = User::find($id);
        $user->update($request->only([
            'name', 'username', 'bio', 'game_id', 
            'instagram_url', 'youtube_url', 'discord_url', 'custom_tagline'
        ]));

        return response()->json($user);
    }

    public function stats($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json([
            'matches_played' => $user->matches_played,
            'matches_won' => $user->matches_won,
            'kills' => $user->kills,
            'deaths' => $user->deaths,
            'wins' => $user->wins,
            'mvp_count' => $user->mvp_count,
            'performance_points' => $user->performance_points,
            'level' => $user->level,
            'xp' => $user->xp,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q', '');

        $users = User::where('username', 'LIKE', "%{$query}%")
            ->orWhere('name', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get(['id', 'name', 'username', 'avatar_url', 'level']);

        return response()->json($users);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Team;
use App\Models\Tower;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function players()
    {
        $players = User::orderBy('performance_points', 'desc')
            ->limit(100)
            ->get(['id', 'name', 'username', 'avatar_url', 'level', 'performance_points', 'matches_played', 'matches_won', 'kills', 'deaths']);

        return response()->json($players);
    }

    public function teams()
    {
        $teams = Team::with(['tower', 'captain'])
            ->orderBy('total_points', 'desc')
            ->limit(100)
            ->get();

        return response()->json($teams);
    }

    public function towers()
    {
        $towers = Tower::with(['leader'])
            ->withCount('members')
            ->withCount('teams')
            ->orderBy('total_points', 'desc')
            ->limit(100)
            ->get();

        return response()->json($towers);
    }
}

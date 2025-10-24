<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Team;
use App\Models\Tower;
use App\Models\Tournament;
use App\Models\TournamentRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class XPManagementController extends Controller
{
    // XP Constants
    const XP_PER_LEVEL = 1000;
    const XP_TOURNAMENT_PARTICIPATION = 50;
    const XP_TOURNAMENT_WIN = 500;
    const XP_TOURNAMENT_SECOND = 300;
    const XP_TOURNAMENT_THIRD = 200;
    const XP_KILL = 10;
    const XP_DEATH = -5;
    const XP_MVP = 100;

    // Award XP to Player
    public function awardXP(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN' && $authUser->role != 'ORGANISER') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'xp_amount' => 'required|integer',
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $user = User::find($request->user_id);
        $this->addXP($user, $request->xp_amount, $request->reason);

        return response()->json([
            'message' => 'XP awarded successfully',
            'user' => $user->fresh(),
        ]);
    }

    // Update Match Stats and Award XP
    public function updateMatchStats(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN' && $authUser->role != 'ORGANISER') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'tournament_id' => 'required|exists:tournaments,id',
            'team_id' => 'required|exists:teams,id',
            'position' => 'required|integer|min:1',
            'players' => 'required|array',
            'players.*.user_id' => 'required|exists:users,id',
            'players.*.kills' => 'required|integer|min:0',
            'players.*.deaths' => 'required|integer|min:0',
            'players.*.is_mvp' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        DB::beginTransaction();
        try {
            $tournament = Tournament::find($request->tournament_id);
            $team = Team::with('tower')->find($request->team_id);
            $position = $request->position;

            // Position-based XP
            $positionXP = 0;
            if ($position == 1) {
                $positionXP = self::XP_TOURNAMENT_WIN;
            } elseif ($position == 2) {
                $positionXP = self::XP_TOURNAMENT_SECOND;
            } elseif ($position == 3) {
                $positionXP = self::XP_TOURNAMENT_THIRD;
            }

            $updatedPlayers = [];

            foreach ($request->players as $playerData) {
                $user = User::find($playerData['user_id']);
                
                // Update match stats
                $user->matches_played += 1;
                if ($position == 1) {
                    $user->matches_won += 1;
                    $user->wins += 1;
                }
                $user->kills += $playerData['kills'];
                $user->deaths += $playerData['deaths'];
                
                if (isset($playerData['is_mvp']) && $playerData['is_mvp']) {
                    $user->mvp_count += 1;
                }

                // Calculate total XP
                $totalXP = self::XP_TOURNAMENT_PARTICIPATION; // Base participation
                $totalXP += $positionXP; // Position bonus
                $totalXP += ($playerData['kills'] * self::XP_KILL); // Kill bonus
                $totalXP += ($playerData['deaths'] * self::XP_DEATH); // Death penalty
                
                if (isset($playerData['is_mvp']) && $playerData['is_mvp']) {
                    $totalXP += self::XP_MVP; // MVP bonus
                }

                // Add XP and level up
                $this->addXP($user, $totalXP, "Tournament: {$tournament->title} - Position: {$position}");

                // Update performance points
                $performanceBonus = ($playerData['kills'] * 10) - ($playerData['deaths'] * 5);
                if ($position == 1) $performanceBonus += 100;
                elseif ($position == 2) $performanceBonus += 50;
                elseif ($position == 3) $performanceBonus += 25;
                
                $user->performance_points += $performanceBonus;
                $user->save();

                $updatedPlayers[] = $user;
            }

            // Update Team Points
            $teamPoints = 0;
            if ($position == 1) $teamPoints = 100;
            elseif ($position == 2) $teamPoints = 75;
            elseif ($position == 3) $teamPoints = 50;
            else $teamPoints = 25;

            $team->total_points += $teamPoints;
            $team->save();

            // Update Tower Points
            $team->tower->total_points += $teamPoints;
            $team->tower->save();

            DB::commit();

            return response()->json([
                'message' => 'Match stats updated successfully',
                'players' => $updatedPlayers,
                'team' => $team->fresh(),
                'tower' => $team->tower->fresh(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update stats: ' . $e->getMessage()], 500);
        }
    }

    // Bulk Update Tournament Results
    public function updateTournamentResults(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN' && $authUser->role != 'ORGANISER') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'tournament_id' => 'required|exists:tournaments,id',
            'results' => 'required|array',
            'results.*.team_id' => 'required|exists:teams,id',
            'results.*.position' => 'required|integer|min:1',
            'results.*.players' => 'required|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        DB::beginTransaction();
        try {
            $tournament = Tournament::find($request->tournament_id);
            $allResults = [];

            foreach ($request->results as $result) {
                $response = $this->updateMatchStats(new Request([
                    'tournament_id' => $request->tournament_id,
                    'team_id' => $result['team_id'],
                    'position' => $result['position'],
                    'players' => $result['players'],
                ]));

                $allResults[] = $response->getData();
            }

            // Mark tournament as completed
            $tournament->status = 'COMPLETED';
            $tournament->save();

            DB::commit();

            return response()->json([
                'message' => 'Tournament results updated successfully',
                'tournament' => $tournament,
                'results' => $allResults,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update results: ' . $e->getMessage()], 500);
        }
    }

    // Add XP and Handle Level Up
    private function addXP($user, $xpAmount, $reason = '')
    {
        $user->xp += $xpAmount;

        // Check for level up
        $newLevel = floor($user->xp / self::XP_PER_LEVEL) + 1;
        
        if ($newLevel > $user->level) {
            $user->level = $newLevel;
            // You can add level up rewards here
        }

        $user->save();

        // Log XP transaction (optional - you can create a separate table for this)
        \Log::info("XP Award: User {$user->id} received {$xpAmount} XP. Reason: {$reason}");

        return $user;
    }

    // Get XP Leaderboard
    public function xpLeaderboard()
    {
        $leaderboard = User::where('role', 'PLAYER')
            ->orderBy('xp', 'desc')
            ->limit(100)
            ->get(['id', 'name', 'username', 'avatar_url', 'level', 'xp', 'performance_points', 'matches_played', 'matches_won']);

        return response()->json($leaderboard);
    }

    // Get User XP History (if you want to track detailed history)
    public function userXPHistory($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Return user stats and calculated XP breakdown
        $xpBreakdown = [
            'current_xp' => $user->xp,
            'current_level' => $user->level,
            'xp_to_next_level' => (($user->level + 1) * self::XP_PER_LEVEL) - $user->xp,
            'progress_percentage' => (($user->xp % self::XP_PER_LEVEL) / self::XP_PER_LEVEL) * 100,
            'total_matches' => $user->matches_played,
            'total_wins' => $user->matches_won,
            'total_kills' => $user->kills,
            'total_deaths' => $user->deaths,
            'mvp_count' => $user->mvp_count,
            'performance_points' => $user->performance_points,
            'estimated_xp_from_matches' => $user->matches_played * self::XP_TOURNAMENT_PARTICIPATION,
            'estimated_xp_from_kills' => $user->kills * self::XP_KILL,
            'estimated_xp_from_mvp' => $user->mvp_count * self::XP_MVP,
        ];

        return response()->json($xpBreakdown);
    }

    // Reset User Stats (Admin only)
    public function resetUserStats(Request $request, $userId)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->update([
            'level' => 1,
            'xp' => 0,
            'matches_played' => 0,
            'matches_won' => 0,
            'kills' => 0,
            'deaths' => 0,
            'wins' => 0,
            'mvp_count' => 0,
            'performance_points' => 0,
        ]);

        return response()->json([
            'message' => 'User stats reset successfully',
            'user' => $user,
        ]);
    }

    // Adjust Team/Tower Points
    public function adjustPoints(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'required|in:team,tower',
            'id' => 'required|integer',
            'points' => 'required|integer',
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        if ($request->type == 'team') {
            $entity = Team::find($request->id);
        } else {
            $entity = Tower::find($request->id);
        }

        if (!$entity) {
            return response()->json(['error' => ucfirst($request->type) . ' not found'], 404);
        }

        $entity->total_points += $request->points;
        $entity->save();

        return response()->json([
            'message' => 'Points adjusted successfully',
            $request->type => $entity,
        ]);
    }
}

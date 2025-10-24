<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TowerController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TournamentController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrganizerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\XPManagementController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    
    // Auth
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Users
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::get('/users/{id}/stats', [UserController::class, 'stats']);
    Route::get('/users/search', [UserController::class, 'search']);
    
    // Towers
    Route::get('/towers', [TowerController::class, 'index']);
    Route::post('/towers', [TowerController::class, 'store']);
    Route::get('/towers/{id}', [TowerController::class, 'show']);
    Route::put('/towers/{id}', [TowerController::class, 'update']);
    Route::delete('/towers/{id}', [TowerController::class, 'destroy']);
    Route::post('/towers/join', [TowerController::class, 'join']);
    
    // Teams
    Route::get('/teams', [TeamController::class, 'index']);
    Route::post('/teams', [TeamController::class, 'store']);
    Route::get('/teams/{id}', [TeamController::class, 'show']);
    Route::put('/teams/{id}', [TeamController::class, 'update']);
    Route::delete('/teams/{id}', [TeamController::class, 'destroy']);
    
    // Tournaments
    Route::get('/tournaments', [TournamentController::class, 'index']);
    Route::post('/tournaments', [TournamentController::class, 'store']);
    Route::get('/tournaments/{id}', [TournamentController::class, 'show']);
    Route::put('/tournaments/{id}', [TournamentController::class, 'update']);
    Route::delete('/tournaments/{id}', [TournamentController::class, 'destroy']);
    Route::post('/tournaments/{id}/register', [TournamentController::class, 'register']);
    Route::get('/tournaments/{id}/registrations', [TournamentController::class, 'registrations']);
    Route::patch('/tournaments/{id}/room', [TournamentController::class, 'updateRoom']);
    
    // Leaderboard
    Route::get('/leaderboard/players', [LeaderboardController::class, 'players']);
    Route::get('/leaderboard/teams', [LeaderboardController::class, 'teams']);
    Route::get('/leaderboard/towers', [LeaderboardController::class, 'towers']);
    
    // Admin
    Route::get('/admin/stats/users', [AdminController::class, 'userStats']);
    Route::get('/admin/stats/tournaments', [AdminController::class, 'tournamentStats']);
    Route::get('/admin/stats/towers', [AdminController::class, 'towerStats']);
    Route::get('/admin/organizer/applications', [AdminController::class, 'organizerApplications']);
    Route::patch('/admin/organizer/applications/{id}', [AdminController::class, 'updateApplicationStatus']);
    
    // Organizer
    Route::post('/organizer/apply', [OrganizerController::class, 'apply']);
    Route::get('/organizer/my-application', [OrganizerController::class, 'myApplication']);
    Route::get('/organizer/tournaments', [OrganizerController::class, 'myTournaments']);
    
    // Dashboard & Monitoring
    Route::get('/dashboard/admin', [DashboardController::class, 'adminDashboard']);
    Route::get('/dashboard/organizer-activity', [DashboardController::class, 'organizerActivity']);
    Route::get('/dashboard/player-activity', [DashboardController::class, 'playerActivity']);
    Route::get('/dashboard/tower-management', [DashboardController::class, 'towerManagement']);
    Route::get('/dashboard/search', [DashboardController::class, 'globalSearch']);
    
    // XP Management
    Route::post('/xp/award', [XPManagementController::class, 'awardXP']);
    Route::post('/xp/match-stats', [XPManagementController::class, 'updateMatchStats']);
    Route::post('/xp/tournament-results', [XPManagementController::class, 'updateTournamentResults']);
    Route::get('/xp/leaderboard', [XPManagementController::class, 'xpLeaderboard']);
    Route::get('/xp/history/{userId}', [XPManagementController::class, 'userXPHistory']);
    Route::post('/xp/reset/{userId}', [XPManagementController::class, 'resetUserStats']);
    Route::post('/xp/adjust-points', [XPManagementController::class, 'adjustPoints']);
});

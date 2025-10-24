<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'mobile',
        'email',
        'password',
        'avatar_url',
        'bio',
        'game_id',
        'role',
        'level',
        'xp',
        'matches_played',
        'matches_won',
        'kills',
        'deaths',
        'wins',
        'mvp_count',
        'performance_points',
        'instagram_url',
        'youtube_url',
        'discord_url',
        'custom_tagline',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role
        ];
    }

    // Relationships
    public function ledTowers()
    {
        return $this->hasMany(Tower::class, 'leader_id');
    }

    public function coLedTowers()
    {
        return $this->hasMany(Tower::class, 'co_leader_id');
    }

    public function towerMemberships()
    {
        return $this->belongsToMany(Tower::class, 'tower_members')->withTimestamps();
    }

    public function captainedTeams()
    {
        return $this->hasMany(Team::class, 'captain_id');
    }

    public function teamMemberships()
    {
        return $this->belongsToMany(Team::class, 'team_members')->withTimestamps();
    }

    public function organizedTournaments()
    {
        return $this->belongsToMany(Tournament::class, 'tournament_organizers')->withTimestamps();
    }

    public function organizerApplication()
    {
        return $this->hasOne(OrganizerApplication::class);
    }
}

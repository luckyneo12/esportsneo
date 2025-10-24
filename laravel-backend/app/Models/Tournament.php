<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tournament extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'game',
        'description',
        'rules',
        'status',
        'max_teams',
        'entry_fee',
        'prize_pool',
        'match_date_time',
        'room_id',
        'room_password',
        'banner_url',
        'logo_url',
    ];

    protected $casts = [
        'match_date_time' => 'datetime',
        'entry_fee' => 'decimal:2',
        'prize_pool' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function organizers()
    {
        return $this->belongsToMany(User::class, 'tournament_organizers')->withTimestamps();
    }

    public function registrations()
    {
        return $this->hasMany(TournamentRegistration::class);
    }
}

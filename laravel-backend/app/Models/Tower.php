<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tower extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'description',
        'logo_url',
        'leader_id',
        'co_leader_id',
        'max_teams',
        'max_members',
        'total_points',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function leader()
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function coLeader()
    {
        return $this->belongsTo(User::class, 'co_leader_id');
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'tower_members')->withTimestamps();
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }
}

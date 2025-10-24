<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('mobile', 10)->unique();
            $table->string('email')->nullable()->unique();
            $table->string('password');
            $table->string('avatar_url')->nullable();
            $table->text('bio')->nullable();
            $table->string('game_id')->nullable();
            $table->enum('role', ['PLAYER', 'ORGANISER', 'SUPER_ADMIN'])->default('PLAYER');
            
            // Stats
            $table->integer('level')->default(1);
            $table->integer('xp')->default(0);
            $table->integer('matches_played')->default(0);
            $table->integer('matches_won')->default(0);
            $table->integer('kills')->default(0);
            $table->integer('deaths')->default(0);
            $table->integer('wins')->default(0);
            $table->integer('mvp_count')->default(0);
            $table->integer('performance_points')->default(0);
            
            // Social Links
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('discord_url')->nullable();
            $table->string('custom_tagline')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

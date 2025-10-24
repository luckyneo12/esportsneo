<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tournaments', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('game');
            $table->text('description')->nullable();
            $table->text('rules')->nullable();
            $table->enum('status', ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'])->default('UPCOMING');
            $table->integer('max_teams')->default(16);
            $table->decimal('entry_fee', 10, 2)->default(0);
            $table->decimal('prize_pool', 10, 2)->default(0);
            $table->dateTime('match_date_time');
            $table->string('room_id')->nullable();
            $table->string('room_password')->nullable();
            $table->string('banner_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tournaments');
    }
};

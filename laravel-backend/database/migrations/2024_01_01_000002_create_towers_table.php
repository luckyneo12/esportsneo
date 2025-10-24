<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('towers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code', 10)->unique();
            $table->text('description')->nullable();
            $table->string('logo_url')->nullable();
            $table->foreignId('leader_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('co_leader_id')->nullable()->constrained('users')->onDelete('set null');
            $table->integer('max_teams')->default(10);
            $table->integer('max_members')->default(50);
            $table->integer('total_points')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('towers');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('description')->nullable();
            $table->string('fichier')->nullable();
            $table->enum('type', ['video', 'image', 'texte', 'live'])->default('texte');
            $table->enum('visibilite', ['public', 'abonnes', 'personnalise'])->default('public');
            $table->boolean('is_live')->default(false);
            $table->timestamp('live_started_at')->nullable();
            $table->integer('vues')->default(0);
            $table->integer('likes_count')->default(0);
            $table->integer('comments_count')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};


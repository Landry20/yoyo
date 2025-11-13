<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('blocage_capture')->default(true);
            $table->boolean('auto_destruction')->default(false);
            $table->integer('duree_auto_destruction')->nullable()->comment('Durée en secondes');
            $table->enum('visibilite', ['public', 'abonnes', 'personnalise'])->default('public');
            $table->boolean('notifications_push')->default(true);
            $table->boolean('notifications_message')->default(true);
            $table->boolean('notifications_commentaire')->default(true);
            $table->boolean('notifications_abonnement')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};


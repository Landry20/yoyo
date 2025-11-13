<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'blocage_capture',
        'auto_destruction',
        'duree_auto_destruction',
        'visibilite',
        'notifications_push',
        'notifications_message',
        'notifications_commentaire',
        'notifications_abonnement',
    ];

    protected function casts(): array
    {
        return [
            'blocage_capture' => 'boolean',
            'auto_destruction' => 'boolean',
            'notifications_push' => 'boolean',
            'notifications_message' => 'boolean',
            'notifications_commentaire' => 'boolean',
            'notifications_abonnement' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}


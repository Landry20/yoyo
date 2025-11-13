<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Message extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'contenu',
        'type',
        'fichier',
        'confidentialite',
        'expire',
        'expires_at',
        'is_read',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'confidentialite' => 'boolean',
            'expire' => 'boolean',
            'is_read' => 'boolean',
            'expires_at' => 'datetime',
            'read_at' => 'datetime',
        ];
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function isExpired(): bool
    {
        if (!$this->expire || !$this->expires_at) {
            return false;
        }
        return Carbon::now()->greaterThan($this->expires_at);
    }

    public function markAsRead(): void
    {
        if (!$this->is_read) {
            $this->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        }
    }

    public function getDisplaySenderName(): string
    {
        if ($this->sender->statut_anonymat === 'anonyme') {
            return 'Utilisateur anonyme';
        }
        return $this->sender->nom;
    }

    public function getDisplaySenderPhoto(): ?string
    {
        if ($this->sender->statut_anonymat === 'anonyme' || $this->sender->statut_anonymat === 'masque') {
            return null;
        }
        return $this->sender->photo;
    }
}


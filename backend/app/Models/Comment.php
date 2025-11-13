<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'post_id',
        'user_id',
        'contenu',
        'anonyme',
        'likes_count',
    ];

    protected function casts(): array
    {
        return [
            'anonyme' => 'boolean',
            'likes_count' => 'integer',
        ];
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->morphMany(\App\Models\Like::class, 'likeable');
    }

    public function getDisplayName(): string
    {
        if ($this->anonyme || $this->user->statut_anonymat === 'anonyme') {
            return 'Utilisateur anonyme';
        }
        return $this->user->nom;
    }

    public function getDisplayPhoto(): ?string
    {
        if ($this->anonyme || $this->user->statut_anonymat === 'anonyme' || $this->user->statut_anonymat === 'masque') {
            return null;
        }
        return $this->user->photo;
    }
}


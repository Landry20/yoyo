<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'description',
        'fichier',
        'type',
        'visibilite',
        'is_live',
        'live_started_at',
        'vues',
        'likes_count',
        'comments_count',
    ];

    protected function casts(): array
    {
        return [
            'is_live' => 'boolean',
            'live_started_at' => 'datetime',
            'vues' => 'integer',
            'likes_count' => 'integer',
            'comments_count' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comments()
    {
        return $this->hasMany(\App\Models\Comment::class);
    }

    public function likes()
    {
        return $this->morphMany(\App\Models\Like::class, 'likeable');
    }

    public function incrementViews()
    {
        $this->increment('vues');
    }
}


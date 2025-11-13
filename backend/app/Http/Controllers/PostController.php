<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::with(['user', 'comments.user', 'likes'])
            ->where('is_live', false)
            ->orderBy('created_at', 'desc');

        // Filtrer par utilisateur
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filtrer par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $posts = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'nullable|string|max:1000',
            'fichier' => 'required|file|mimes:mp4,avi,mov,jpeg,png,jpg,gif|max:102400', // 100MB max
            'type' => 'required|in:video,image,texte',
            'visibilite' => 'sometimes|in:public,abonnes,personnalise',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();
        $filePath = null;

        if ($request->hasFile('fichier')) {
            $filePath = $request->file('fichier')->store('posts', 'public');
        }

        $post = Post::create([
            'user_id' => $user->id,
            'description' => $request->description,
            'fichier' => $filePath,
            'type' => $request->type,
            'visibilite' => $request->visibilite ?? 'public',
        ]);

        $post->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Post créé avec succès',
            'data' => $post
        ], 201);
    }

    public function show($id)
    {
        $post = Post::with(['user', 'comments.user', 'likes.user'])
            ->findOrFail($id);

        // Incrémenter les vues
        $post->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);
        $user = auth()->user();

        if ($post->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'description' => 'sometimes|string|max:1000',
            'visibilite' => 'sometimes|in:public,abonnes,personnalise',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $post->update($request->only(['description', 'visibilite']));

        return response()->json([
            'success' => true,
            'message' => 'Post mis à jour',
            'data' => $post
        ]);
    }

    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $user = auth()->user();

        if ($post->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        if ($post->fichier) {
            Storage::disk('public')->delete($post->fichier);
        }

        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Post supprimé'
        ]);
    }

    public function like($id)
    {
        $post = Post::findOrFail($id);
        $user = auth()->user();

        $like = Like::where('user_id', $user->id)
            ->where('likeable_id', $post->id)
            ->where('likeable_type', Post::class)
            ->first();

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
            return response()->json([
                'success' => true,
                'message' => 'Like retiré',
                'data' => ['is_liked' => false]
            ]);
        }

        Like::create([
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => Post::class,
        ]);

        $post->increment('likes_count');

        return response()->json([
            'success' => true,
            'message' => 'Post liké',
            'data' => ['is_liked' => true]
        ]);
    }

    public function startLive(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();

        // Vérifier si l'utilisateur a déjà un live actif
        $activeLive = Post::where('user_id', $user->id)
            ->where('is_live', true)
            ->first();

        if ($activeLive) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà un live actif'
            ], 400);
        }

        $live = Post::create([
            'user_id' => $user->id,
            'description' => $request->description,
            'type' => 'live',
            'is_live' => true,
            'live_started_at' => now(),
            'visibilite' => 'public',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Live démarré',
            'data' => $live
        ], 201);
    }

    public function endLive($id)
    {
        $live = Post::findOrFail($id);
        $user = auth()->user();

        if ($live->user_id !== $user->id || !$live->is_live) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $live->update([
            'is_live' => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Live terminé',
            'data' => $live
        ]);
    }

    public function getLives()
    {
        $lives = Post::with('user')
            ->where('is_live', true)
            ->orderBy('live_started_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $lives
        ]);
    }
}


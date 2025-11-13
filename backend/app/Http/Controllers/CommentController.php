<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CommentController extends Controller
{
    public function index($postId)
    {
        $comments = Comment::with(['user', 'likes'])
            ->where('post_id', $postId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    public function store(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);

        $validator = Validator::make($request->all(), [
            'contenu' => 'required|string|max:500',
            'anonyme' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = auth()->user();

        $comment = Comment::create([
            'post_id' => $post->id,
            'user_id' => $user->id,
            'contenu' => $request->contenu,
            'anonyme' => $request->anonyme ?? false,
        ]);

        // Incrémenter le compteur de commentaires
        $post->increment('comments_count');

        $comment->load('user');

        return response()->json([
            'success' => true,
            'message' => 'Commentaire ajouté',
            'data' => $comment
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        $user = auth()->user();

        if ($comment->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'contenu' => 'required|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $comment->update($request->only('contenu'));

        return response()->json([
            'success' => true,
            'message' => 'Commentaire mis à jour',
            'data' => $comment
        ]);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);
        $user = auth()->user();

        if ($comment->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        // Décrémenter le compteur de commentaires
        $comment->post->decrement('comments_count');

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Commentaire supprimé'
        ]);
    }

    public function like($id)
    {
        $comment = Comment::findOrFail($id);
        $user = auth()->user();

        $like = Like::where('user_id', $user->id)
            ->where('likeable_id', $comment->id)
            ->where('likeable_type', Comment::class)
            ->first();

        if ($like) {
            $like->delete();
            $comment->decrement('likes_count');
            return response()->json([
                'success' => true,
                'message' => 'Like retiré',
                'data' => ['is_liked' => false]
            ]);
        }

        Like::create([
            'user_id' => $user->id,
            'likeable_id' => $comment->id,
            'likeable_type' => Comment::class,
        ]);

        $comment->increment('likes_count');

        return response()->json([
            'success' => true,
            'message' => 'Commentaire liké',
            'data' => ['is_liked' => true]
        ]);
    }
}


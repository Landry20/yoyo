<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Récupérer toutes les conversations
        $conversations = Message::where(function($query) use ($user) {
                $query->where('sender_id', $user->id)
                      ->orWhere('receiver_id', $user->id);
            })
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function($message) use ($user) {
                return $message->sender_id === $user->id 
                    ? $message->receiver_id 
                    : $message->sender_id;
            })
            ->map(function($messages) use ($user) {
                $lastMessage = $messages->first();
                $otherUser = $lastMessage->sender_id === $user->id 
                    ? $lastMessage->receiver 
                    : $lastMessage->sender;
                
                $unreadCount = $messages->where('receiver_id', $user->id)
                    ->where('is_read', false)
                    ->count();

                return [
                    'user' => $otherUser,
                    'last_message' => $lastMessage,
                    'unread_count' => $unreadCount,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'data' => $conversations
        ]);
    }

    public function show($userId)
    {
        $currentUser = auth()->user();
        $otherUser = User::findOrFail($userId);

        $messages = Message::where(function($query) use ($currentUser, $otherUser) {
                $query->where(function($q) use ($currentUser, $otherUser) {
                    $q->where('sender_id', $currentUser->id)
                      ->where('receiver_id', $otherUser->id);
                })->orWhere(function($q) use ($currentUser, $otherUser) {
                    $q->where('sender_id', $otherUser->id)
                      ->where('receiver_id', $currentUser->id);
                });
            })
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->filter(function($message) {
                // Filtrer les messages expirés
                return !$message->isExpired();
            })
            ->map(function($message) {
                // Masquer les informations si anonyme
                if ($message->sender->statut_anonymat === 'anonyme') {
                    $message->sender->nom = 'Utilisateur anonyme';
                    $message->sender->photo = null;
                }
                return $message;
            });

        // Marquer les messages comme lus
        Message::where('sender_id', $otherUser->id)
            ->where('receiver_id', $currentUser->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json([
            'success' => true,
            'data' => $messages
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'contenu' => 'required_without:fichier|string|max:5000',
            'type' => 'required|in:texte,audio,image,video,document',
            'fichier' => 'required_if:type,audio,image,video,document|file|max:102400', // 100MB
            'confidentialite' => 'sometimes|boolean',
            'expire' => 'sometimes|boolean',
            'expires_at' => 'required_if:expire,true|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $sender = auth()->user();
        $receiver = User::findOrFail($request->receiver_id);

        if ($sender->id === $receiver->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas vous envoyer un message à vous-même'
            ], 400);
        }

        $filePath = null;
        if ($request->hasFile('fichier')) {
            $filePath = $request->file('fichier')->store('messages', 'public');
        }

        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
            'contenu' => $request->contenu,
            'type' => $request->type,
            'fichier' => $filePath,
            'confidentialite' => $request->confidentialite ?? false,
            'expire' => $request->expire ?? false,
            'expires_at' => $request->expires_at ? Carbon::parse($request->expires_at) : null,
        ]);

        $message->load(['sender', 'receiver']);

        // TODO: Envoyer une notification push via FCM

        return response()->json([
            'success' => true,
            'message' => 'Message envoyé',
            'data' => $message
        ], 201);
    }

    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $user = auth()->user();

        if ($message->sender_id !== $user->id && $message->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        if ($message->fichier) {
            Storage::disk('public')->delete($message->fichier);
        }

        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message supprimé'
        ]);
    }

    public function markAsRead($id)
    {
        $message = Message::findOrFail($id);
        $user = auth()->user();

        if ($message->receiver_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $message->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Message marqué comme lu',
            'data' => $message
        ]);
    }
}


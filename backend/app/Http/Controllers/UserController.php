<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Recherche par nom
        if ($request->has('search')) {
            $query->where('nom', 'like', '%' . $request->search . '%');
        }

        $users = $query->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    public function show($id)
    {
        $user = User::with(['settings', 'posts', 'followers', 'following'])
            ->findOrFail($id);

        $currentUser = auth()->user();
        
        // Masquer les informations si l'utilisateur est anonyme
        if ($user->statut_anonymat === 'anonyme' && $user->id !== $currentUser->id) {
            $user->nom = 'Utilisateur anonyme';
            $user->photo = null;
            $user->email = null;
            $user->telephone = null;
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'telephone' => 'sometimes|nullable|string|unique:users,telephone,' . $user->id,
            'photo' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
            'statut_anonymat' => 'sometimes|in:public,masque,anonyme',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['nom', 'email', 'telephone', 'statut_anonymat']);

        // Gestion de la photo
        if ($request->hasFile('photo')) {
            if ($user->photo) {
                Storage::disk('public')->delete($user->photo);
            }
            $data['photo'] = $request->file('photo')->store('photos', 'public');
        }

        // Mise à jour du mot de passe
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);
        $user->load('settings');

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour',
            'data' => $user
        ]);
    }

    public function follow($id)
    {
        $userToFollow = User::findOrFail($id);
        $currentUser = auth()->user();

        if ($currentUser->id === $userToFollow->id) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas vous abonner à vous-même'
            ], 400);
        }

        if ($currentUser->isFollowing($userToFollow)) {
            $currentUser->following()->detach($userToFollow->id);
            return response()->json([
                'success' => true,
                'message' => 'Abonnement retiré',
                'data' => ['is_following' => false]
            ]);
        }

        $currentUser->following()->attach($userToFollow->id);

        return response()->json([
            'success' => true,
            'message' => 'Abonnement ajouté',
            'data' => ['is_following' => true]
        ]);
    }

    public function followers($id)
    {
        $user = User::findOrFail($id);
        $followers = $user->followers()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $followers
        ]);
    }

    public function following($id)
    {
        $user = User::findOrFail($id);
        $following = $user->following()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $following
        ]);
    }
}


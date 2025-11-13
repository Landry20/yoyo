<?php

namespace App\Http\Controllers;

use App\Models\Settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    public function show()
    {
        $user = auth()->user();
        $settings = Settings::firstOrCreate(
            ['user_id' => $user->id],
            [
                'blocage_capture' => true,
                'auto_destruction' => false,
                'visibilite' => 'public',
                'notifications_push' => true,
                'notifications_message' => true,
                'notifications_commentaire' => true,
                'notifications_abonnement' => true,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        $settings = Settings::firstOrCreate(['user_id' => $user->id]);

        $validator = Validator::make($request->all(), [
            'blocage_capture' => 'sometimes|boolean',
            'auto_destruction' => 'sometimes|boolean',
            'duree_auto_destruction' => 'required_if:auto_destruction,true|integer|min:1|max:86400', // Max 24h
            'visibilite' => 'sometimes|in:public,abonnes,personnalise',
            'notifications_push' => 'sometimes|boolean',
            'notifications_message' => 'sometimes|boolean',
            'notifications_commentaire' => 'sometimes|boolean',
            'notifications_abonnement' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $settings->update($request->only([
            'blocage_capture',
            'auto_destruction',
            'duree_auto_destruction',
            'visibilite',
            'notifications_push',
            'notifications_message',
            'notifications_commentaire',
            'notifications_abonnement',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Paramètres mis à jour',
            'data' => $settings
        ]);
    }
}


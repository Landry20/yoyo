<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\SettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Routes publiques
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Routes protégées
Route::middleware(['jwt.auth'])->group(function () {
    // Authentification
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    // Utilisateurs
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{id}', [UserController::class, 'show']);
        Route::put('/', [UserController::class, 'update']);
        Route::post('/{id}/follow', [UserController::class, 'follow']);
        Route::get('/{id}/followers', [UserController::class, 'followers']);
        Route::get('/{id}/following', [UserController::class, 'following']);
    });

    // Posts
    Route::prefix('posts')->group(function () {
        Route::get('/', [PostController::class, 'index']);
        Route::post('/', [PostController::class, 'store']);
        Route::get('/{id}', [PostController::class, 'show']);
        Route::put('/{id}', [PostController::class, 'update']);
        Route::delete('/{id}', [PostController::class, 'destroy']);
        Route::post('/{id}/like', [PostController::class, 'like']);
    });

    // Lives
    Route::prefix('lives')->group(function () {
        Route::get('/', [PostController::class, 'getLives']);
        Route::post('/', [PostController::class, 'startLive']);
        Route::post('/{id}/end', [PostController::class, 'endLive']);
    });

    // Commentaires
    Route::prefix('posts/{postId}/comments')->group(function () {
        Route::get('/', [CommentController::class, 'index']);
        Route::post('/', [CommentController::class, 'store']);
        Route::put('/{id}', [CommentController::class, 'update']);
        Route::delete('/{id}', [CommentController::class, 'destroy']);
        Route::post('/{id}/like', [CommentController::class, 'like']);
    });

    // Messages
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index']);
        Route::get('/{userId}', [MessageController::class, 'show']);
        Route::post('/', [MessageController::class, 'store']);
        Route::delete('/{id}', [MessageController::class, 'destroy']);
        Route::post('/{id}/read', [MessageController::class, 'markAsRead']);
    });

    // Paramètres
    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'show']);
        Route::put('/', [SettingsController::class, 'update']);
    });
});


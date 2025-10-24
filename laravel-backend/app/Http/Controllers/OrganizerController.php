<?php

namespace App\Http\Controllers;

use App\Models\OrganizerApplication;
use App\Models\Tournament;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrganizerController extends Controller
{
    public function apply(Request $request)
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        // Check if already applied
        $existing = OrganizerApplication::where('user_id', $authUser->id)->first();

        if ($existing) {
            return response()->json(['error' => 'You have already applied'], 400);
        }

        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
            'experience' => 'nullable|string',
            'social_links' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 400);
        }

        $application = OrganizerApplication::create([
            'user_id' => $authUser->id,
            'reason' => $request->reason,
            'experience' => $request->experience,
            'social_links' => $request->social_links,
            'status' => 'PENDING',
        ]);

        return response()->json($application, 201);
    }

    public function myApplication()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        $application = OrganizerApplication::where('user_id', $authUser->id)->first();

        if (!$application) {
            return response()->json(['error' => 'No application found'], 404);
        }

        return response()->json($application);
    }

    public function myTournaments()
    {
        $authUser = JWTAuth::parseToken()->authenticate();

        if ($authUser->role != 'ORGANISER' && $authUser->role != 'SUPER_ADMIN') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $tournaments = Tournament::whereHas('organizers', function($query) use ($authUser) {
            $query->where('user_id', $authUser->id);
        })->with('organizers')->get();

        return response()->json($tournaments);
    }
}

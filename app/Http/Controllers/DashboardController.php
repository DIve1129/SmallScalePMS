<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Patient;
use App\Models\Appointment;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 1. Calculate Summary Cards Data
        $totalPatients = Patient::count();
        
        $todayAppointments = Appointment::whereDate('scheduled_at', $today)->get();
        $todayRevenue = $todayAppointments->sum(function($a) {
            return ($a->amount_1 ?? 0) + ($a->amount_2 ?? 0) + ($a->amount_3 ?? 0);
        });

        $pendingClaims = Appointment::where('claim_status', 'Pending')
            ->whereIn('status', ['Completed', 'No-show'])
            ->count();

        // 2. Build Recent Log Queue Stream
        $recentActivity = Appointment::with(['patient', 'doctor'])
            ->orderBy('updated_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($a) {
                return [
                    'id' => $a->appointment_id,
                    'patient' => $a->patient ? ($a->patient->first_name . ' ' . $a->patient->last_name) : '-',
                    'doctor' => $a->doctor ? ('Dr. ' . $a->doctor->first_name . ' ' . $a->doctor->last_name) : '-',
                    'status' => $a->status,
                    'time' => Carbon::parse($a->scheduled_at)->format('h:i A'),
                ];
            });

        return Inertia::render('dashboard', [
            'stats' => [
                'total_patients' => $totalPatients,
                'today_revenue' => $todayRevenue,
                'pending_claims' => $pendingClaims,
            ],
            'recent_activity' => $recentActivity,
        ]);
    }
}
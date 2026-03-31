<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Inertia\Inertia;

class BillingController extends Controller
{



public function index()
{
    $appointments = Appointment::with('patient')
        ->whereIn('status', ['Completed', 'No-show'])
        ->orderBy('appointment_date', 'desc')
        ->get()
        ->map(function ($a) {
            return [
                'appointment_id' => $a->appointment_id,
                'patient_id' => $a->patient_id,
                'patient_name' => $a->patient
                    ? $a->patient->first_name . ' ' . $a->patient->last_name
                    : '-',
                'doctor_id' => $a->doctor_id,
                'appointment_date' => $a->appointment_Date,
                'appointment_reason' => $a->app_reason ?? '-',
                'bill_amount' => $a->bill_amount ?? 2000,
                'balance' => $a->balance ?? 0,
                'responsibility' => $a->responsibility ?? 'Patient',
                'claim_status' => $a->claim_status ?? 'Pending',
            ];
        });

    return Inertia::render('billing/index', [
        'appointments' => $appointments,
    ]);
}

public function updateStatus(Request $request, $appointment_id)
{
    $appointment = Appointment::findOrFail($appointment_id);

    $validated = $request->validate([
        'responsibility' => 'required|in:Patient,Insurance',
        'claim_status' => 'required|in:Pending,Billed,Closed',
    ]);

    $appointment->update([
        'responsibility' => $validated['responsibility'],
        'claim_status' => $validated['claim_status'],
    ]);

    return back(); // Inertia refresh
}}

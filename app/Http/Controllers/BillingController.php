<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use Inertia\Inertia;

class BillingController extends Controller
{



public function index(Request $request)
{
    $from = $request->input('from');
    $to = $request->input('to');
        
    $appointments = Appointment::with('patient')
        ->whereIn('status', ['Completed', 'No-show','Ongoing'])
        ->orderBy('appointment_Date', 'desc')
        ->when($from && $to, function ($q) use ($from, $to){
            $q->whereBetween('scheduled_at', [
                $from. ' 00:00:00',
                $to. ' 23:59:59',
            ]);
        })
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
                'additional_services' => $a->additional_services ?? '',
                'notes' => $a->notes ?? '',
                'additional_charge' => $a->additional_charge ?? 0,
            ];
        });

    return Inertia::render('billing/index', [
        'appointments' => $appointments,
        'from'=> $from,
        'to' => $to,
    ]);
}
public function edit($appointment_id)
{
    $appointment = Appointment::with('patient')->findOrFail($appointment_id);

    return Inertia::render('billing/edit', [
        'appointment' => [
            'appointment_id' => $appointment->appointment_id,
            'patient_id' => $appointment->patient_id,
            'patient_name' => $appointment->patient
                ? $appointment->patient->first_name . ' ' . $appointment->patient->last_name
                : '-',
            'doctor_id' => $appointment->doctor_id,
            'appointment_reason' => $appointment->app_reason ?? '',
            'additional_services' => $appointment->additional_services ?? '',
            'notes' => $appointment->notes ?? '',
            'additional_charge' => $appointment->additional_charge ?? 0,
            'bill_amount' => $appointment->bill_amount ?? 2000,
            'balance' => $appointment->balance ?? 0,
            'responsibility' => $appointment->responsibility ?? 'Patient',
            'claim_status' => $appointment->claim_status ?? 'Pending',
            'status' => $appointment->status ?? 'Ongoing',
        ],
    ]);
}
public function update(Request $request, $appointment_id)
{
    $appointment = Appointment::findOrFail($appointment_id);

    $validated = $request->validate([
        'appointment_reason' => ['required', 'string', 'max:255'],
        'additional_services' => ['nullable', 'string', 'max:255'],
        'notes' => ['nullable', 'string'],
        'additional_charge' => ['nullable', 'numeric', 'min:0'],
        'responsibility' => ['required', 'in:Patient,Insurance'],
        'claim_status' => ['required', 'in:Pending,Ready to Bill,Billed'],
        'status' => ['required', 'in:Scheduled,Ongoing,Completed,No-show,Cancelled'],
    ]);

    $appointment->update([
        'app_reason' => $validated['appointment_reason'],
        'additional_services' => $validated['additional_services'] ?? null,
        'notes' => $validated['notes'] ?? null,
        'additional_charge' => $validated['additional_charge'] ?? 0,
        'responsibility' => $validated['responsibility'],
        'claim_status' => $validated['claim_status'],
        'status' => $validated['status'],
    ]);

    return redirect()->route('billing.index')
        ->with('success', 'Visit updated successfully.');
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

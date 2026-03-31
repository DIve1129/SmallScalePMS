<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\Patient;

class AppointmentsController extends Controller
{
    /**
     * Show the main Appointments page
     */
    public function index(Request $request)
{
    $from = $request->input('from');
    $to = $request->input('to');

    $appointments = \App\Models\Appointment::query()
        ->leftJoin('patients', 'appointments.patient_id', '=', 'patients.patient_id')
        ->when($from && $to, function ($q) use ($from, $to) {
            $q->whereBetween('appointments.scheduled_at', [
                $from . ' 00:00:00',
                $to . ' 23:59:59',
            ]);
        })
        ->orderBy('appointments.scheduled_at', 'asc')
        ->get([
            'appointments.appointment_id',
            'appointments.patient_id',
            'appointments.app_reason',
            'appointments.scheduled_at',
            'appointments.status',
            'patients.first_name',
            'patients.last_name',
        ])
        ->map(function ($row) {
            $fullName = trim(($row->first_name ?? '') . ' ' . ($row->last_name ?? ''));

            return [
                'appointment_id' => $row->appointment_id,
                'patient_id' => $row->patient_id,
                'patient_name' => $fullName !== '' ? $fullName : '-',
                'age' => null,
                'appointment_type' => $row->app_reason,     //  use app_reason (not app_reason / app_reason mismatch)
                'appointment_datetime' => $row->scheduled_at,
                'status' => $row->status,
            ];
        })
        ->values(); // keeps it as a clean array for JSON/Inertia

    //  THIS is what makes the Appointments page load
    return \Inertia\Inertia::render('appointments/index', [
        'appointments' => $appointments,
        'from' => $from,
        'to' => $to,
    ]);
}


    public function create()
{
    // We need a patient dropdown on the form
    $patients = Patient::query()
        ->orderByDesc('patient_id')
        ->limit(300)
        ->get(['patient_id', 'first_name', 'last_name']);

    return Inertia::render('appointments/create', [
        'patients' => $patients,
    ]);
}
public function appointments($id)
{
    // Pull appointments only for this patient_id
    $appointments = Appointment::query()
        ->where('patient_id', $id)
        ->orderBy('scheduled_at', 'desc')
        ->get([
            'appointment_id',
            'patient_id',
            'app_reason',
            'scheduled_at',
            'status',
        ])
        ->map(function ($a) {
            return [
                'appointment_id' => $a->appointment_id,
                'patient_id' => $a->patient_id,
                'appointment_type' => $a->app_reason,
                'appointment_datetime' => $a->scheduled_at,
                'status' => $a->status,
            ];
        })
        ->values();

    return Inertia::render('patients/appointments', [
        'patientId' => $id,
        'appointments' => $appointments,
    ]);
}


public function store(Request $request)
{
    // Validate incoming data (basic version)
    $validated = $request->validate([
        'patient_id' => ['required'],
        'doctor_id' => ['required', 'string', 'max:100'],
        'app_reason' => ['required', 'string', 'max:100'],
        'scheduled_at' => ['required', 'date'],
        'status' => ['nullable', 'string', 'max:50'],
    ]);

    // Save into DB (matches your schema)
    Appointment::create([
        'patient_id' => $validated['patient_id'],
        'doctor_id' => $validated['doctor_id'],
        'app_reason' => $validated['app_reason'],
        'scheduled_at' => $validated['scheduled_at'],
        'status' => $validated['status'] ?? 'Scheduled',

        // If you still have appointment_Date column and want to keep it in sync:
        'appointment_Date' => $validated['scheduled_at'],
    ]);

    

    return redirect()->route('appointments.index');
}

public function edit(Appointment $appointment)
{
    $patients = Patient::query()
        ->orderByDesc('patient_id')
        ->limit(300)
        ->get(['patient_id', 'first_name', 'last_name']);

    return Inertia::render('appointments/edit', [
        'appointment' => [
            'appointment_id' => $appointment->appointment_id,
            'patient_id' => $appointment->patient_id,
            'doctor_id' => $appointment->doctor_id,
            'app_reason' => $appointment->app_reason,
            'scheduled_at' => $appointment->scheduled_at,
            'status' => $appointment->status ?? 'Scheduled',
        ],
        'patients' => $patients,
    ]);
}

public function update(Request $request, Appointment $appointment)
{
    $validated = $request->validate([
        'patient_id' => ['required'],
        'doctor_id' => ['required', 'string', 'max:100'],
        'app_reason' => ['required', 'string', 'max:100'],
        'scheduled_at' => ['required', 'date'],
        'status' => ['required', 'string', 'max:50'],
    ]);

    $appointment->update([
        'patient_id' => $validated['patient_id'],
        'doctor_id' => $validated['doctor_id'],
        'app_reason' => $validated['app_reason'],
        'scheduled_at' => $validated['scheduled_at'],
        'status' => $validated['status'],
        'appointment_Date' => $validated['scheduled_at'],
    ]);

    return redirect()->route('appointments.index')
        ->with('success', 'Appointment updated successfully.');
}

}

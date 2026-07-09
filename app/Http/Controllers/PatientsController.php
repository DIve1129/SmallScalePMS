<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Patient;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PatientsController extends Controller
{
    /**
     * LIST + SEARCH PATIENTS
     * Search by: first name, last name, DOB, chart number
     */
public function index(Request $request)
{
    $search = trim((string) $request->input('search', ''));

    $patients = Patient::query()
        ->when($search !== '', function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('patient_id', 'like', "%{$search}%"); // numeric id search
            });
        })
        ->orderByDesc('patient_id')
        ->limit(100)
        ->get([
            'patient_id',
            'first_name',
            'last_name',
            'dob',
            'address',
            'created_at',
        ]);

    return Inertia::render('patients/index', [
        'patients' => $patients,
        'search' => $search,
    ]);
}

    /**
     * SHOW CREATE FORM
     */
    public function create()
    {
        return Inertia::render('patients/create');
    }

    /**
     * STORE NEW PATIENT
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'patient_id' => 'required|string|max:30|unique:patients,patient_id',
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'dob'        => 'nullable|date',
            'age'        => 'nullable|integer|min:0|max:150',
            'nic'        => 'nullable|string|max:20',
            'address'    => 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:30',
            'email'      => 'nullable|email|max:150',
            'insurance_name' => 'nullable|string|max:150',
            'insurance_id'   => 'nullable|string|max:100',
            'notes'      => 'nullable|string',
        ]);

        Patient::create($validated);

        return redirect()
            ->route('patients.index')
            ->with('success', 'Patient created successfully.');
    }

    /**
     * UPDATE EXISTING PATIENT
     */
    public function update(Request $request, $id)
    {
        $patient = Patient::where('patient_id', $id)->firstOrFail();

        $validated = $request->validate([
            'patient_id' => 'required|string|max:30|unique:patients,patient_id,' . $patient->patient_id . ',patient_id',
            'first_name' => 'required|string|max:100',
            'last_name'  => 'required|string|max:100',
            'dob'        => 'nullable|date',
            'age'        => 'nullable|integer|min:0|max:150',
            'nic'        => 'nullable|string|max:20',
            'address'    => 'nullable|string|max:255',
            'phone'      => 'nullable|string|max:30',
            'email'      => 'nullable|email|max:150',
            'insurance_name' => 'nullable|string|max:150',
            'insurance_id'   => 'nullable|string|max:100',
            'notes'      => 'nullable|string',
        ]);

        $patient->update($validated);

        return redirect()
            ->route('patients.index')
            ->with('success', 'Patient updated successfully.');
    }

    /**
     * DELETE PATIENT
     */
    public function destroy($id)
    {
        $patient = Patient::findOrFail($id);
        $patient->delete();

        return redirect()
            ->route('patients.index')
            ->with('success', 'Patient deleted successfully.');
    }

    public function show($id)
{
    $patient = Patient::where('patient_id', $id)->firstOrFail();
    return Inertia::render('patients/show', ['patient' => $patient]);
}

public function appointments($id)
{
    $appointments = \App\Models\Appointment::query()
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

    return \Inertia\Inertia::render('patients/appointment', [
        'patientId' => $id,          //  must be patientId
        'appointments' => $appointments,
    ]);
}


public function billing($id)
{
    $patient = Patient::where('patient_id', $id)->firstOrFail();

    $billings = \App\Models\Appointment::where('patient_id', $id)
        ->whereIn('status', ['Completed', 'No-show', 'Ongoing'])
        ->orderBy('scheduled_at', 'desc')
        ->get()
        ->map(function ($a) {
            $amount1 = (float) ($a->amount_1 ?? 0);
            $amount2 = (float) ($a->amount_2 ?? 0);
            $amount3 = (float) ($a->amount_3 ?? 0);

            $payment1 = (float) ($a->payment_1 ?? 0);
            $payment2 = (float) ($a->payment_2 ?? 0);
            $payment3 = (float) ($a->payment_3 ?? 0);

            $totalAmount = $amount1 + $amount2 + $amount3;
            $totalPayment = $payment1 + $payment2 + $payment3;

            return [
                'appointment_id' => $a->appointment_id,
                'patient_id' => $a->patient_id,
                'dos' => $a->scheduled_at ?? $a->appointment_Date,
                'service' => $a->app_reason ?? '-',
                'amount' => $totalAmount,
                'balance' => $totalAmount - $totalPayment,
            ];
        })
        ->values();

    return Inertia::render('patients/billing', [
        'patientId' => $patient->patient_id,
        'billings' => $billings,
    ]);
}

    public function edit($id)
    {
        $patient = Patient::where('patient_id', $id)->firstOrFail();

        return Inertia::render('patients/edit', [
            'patient' => $patient,
        ]);
    }

    public function showClinicalData($appointment_id)
    {
        // Eager load the patient details and doctor links for the layout header strip
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($appointment_id);

        $patientName = $appointment->patient 
            ? trim($appointment->patient->first_name . ' ' . $appointment->patient->last_name) 
            : '-';

        $doctorName = $appointment->doctor 
            ? trim($appointment->doctor->first_name . ' ' . $appointment->doctor->last_name) 
            : '-';

        return Inertia::render('patients/viewclinicaldata', [
            'record' => [
                'appointment_id'        => $appointment->appointment_id,
                'patient_id'            => $appointment->patient_id,
                'patient_name'          => $patientName,
                'doctor_name'           => $doctorName !== '-' ? 'Dr. ' . $doctorName : '-',
                'appointment_date'      => $appointment->appointment_Date,
                'appointment_reason'    => $appointment->app_reason ?? '-',
                
                // Strategy A: Pulling the data straight from your appointments table
                'blood_pressure'        => $appointment->blood_pressure,
                'pulse_rate'            => $appointment->pulse_rate,
                'temperature_c'         => $appointment->temperature_c,
                'weight_kg'             => $appointment->weight_kg,
                'clinical_examination'  => $appointment->clinical_examination,
                'diagnosis'             => $appointment->diagnosis,
                'prescribed_medication' => $appointment->prescribed_medication,
                'plan_of_management'    => $appointment->plan_of_management,
            ]
        ]);
    }

    public function downloadClinicalData($appointment_id)
    {
        // Eager-load relationships to cleanly compile full patient profiles
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($appointment_id);

        $data = [
            'appointment' => $appointment
        ];

        // Compiles the template string into raw PDF metrics stream
        $pdf = Pdf::loadView('pdf.clinicaldata', $data);

        return $pdf->download('clinical-record-' . $appointment->appointment_id . '.pdf');
    }
}

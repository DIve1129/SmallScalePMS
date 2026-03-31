<?php

namespace App\Http\Controllers;

use App\Models\Patient;
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
            'patient_id' => 'nullable|string|max:30|unique:patients,patient_id',
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

        if (empty($validated['patient_id'])) {
            $validated['patient_id'] = 'CH-' . now()->format('YmdHis');
        }

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
        $patient = Patient::findOrFail($id);

        $validated = $request->validate([
            'patient_id' => 'required|string|max:30|unique:patients,patient_id,' . $patient->id,
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
    return Inertia::render('patients/billing', ['patient' => $patient]);
}

}

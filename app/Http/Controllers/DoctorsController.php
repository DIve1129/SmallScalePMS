<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DoctorsController extends Controller
{
    // Show the Doctors list page
    public function index()
    {
        // Get doctors list 
        $doctors = Doctor::query()
            ->orderByDesc('doctor_id')
            ->limit(200)
            ->get([
                'doctor_id',
                'first_name',
                'last_name',
                'speciality',
                'status',
                'created_at',
            ]);

        // Return Inertia page with doctors data
        return Inertia::render('doctors/index', [
            'doctors' => $doctors,
        ]);
    }

    public function show($doctor_id)
{
    $doctor = Doctor::findOrFail($doctor_id);

    return Inertia::render('doctors/Show', [
        'doctor' => $doctor,
    ]);
}

    // Show "Add Doctor" form page
    public function create()
    {
        return Inertia::render('doctors/create');
    }

    public function edit($doctor_id)
{
    $doctor = Doctor::findOrFail($doctor_id);

    return Inertia::render('doctors/edit', [
        'doctor' => $doctor,
    ]);
}

    public function update(Request $request, $doctor_id)
{
    $doctor = Doctor::findOrFail($doctor_id);

    $validated = $request->validate([
        'doctor_code' => 'nullable|string|max:20|unique:doctors,doctor_code,' . $doctor->doctor_id . ',doctor_id',
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'speciality' => 'nullable|string|max:255',
        'slmc_number' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:20',
        'email' => 'nullable|email|max:255',
        'status' => 'required|string|in:Active,Inactive',
    ]);

    $doctor->update($validated);

    return redirect()->route('doctors.show', $doctor->doctor_id)
        ->with('success', 'Doctor updated successfully.');
}

    // Save new doctor to database
    public function store(Request $request)
    {
        // Validate input so DB stays clean
        $validated = $request->validate([
            'doctor_code' => 'nullable|string|max:20|unique:doctors,doctor_code',
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'speciality' => ['nullable', 'string', 'max:255'],
            'slmc_number' => ['required', 'integer', 'unique:doctors,slmc_number'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:120'],
            'status' => ['nullable', 'string', 'max:30'],
        ]);

        // Insert into doctors table
        Doctor::create([
            'doctor_code' => $validated['doctor_code'],
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'speciality' => $validated['speciality'] ?? null,
            'slmc_number' => $validated['slmc_number'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'status' => $validated['status'] ?? 'Active',
        ]);


        // Go back to doctors list
        return redirect()->route('doctors.index');
    }
}

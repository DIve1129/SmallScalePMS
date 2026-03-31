<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Insurance;

class InsuranceController extends Controller
{
    public function index()
    {
        $insurances = Insurance::query()
            ->orderBy('insurance_name')
            ->get([
                'insurance_code',
                'insurance_name',
                'insurance_address',
                'phone',
            ]);

        return Inertia::render('insurances/index', [
            'insurances' => $insurances,
        ]);
    }

    public function create()
    {
        return Inertia::render('insurances/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'insurance_name' => ['required', 'string', 'max:100'],
            'insurance_address' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
        ]);

        Insurance::create($validated);

        return redirect()->route('insurance.index')
            ->with('success', 'Insurance created successfully.');
    }
}
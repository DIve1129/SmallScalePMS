<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Billing;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class BillingController extends Controller
{
    /* Displays all completed and billable appointments with optional date filtering. */
    public function index(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        // Eager-load both 'patient' and 'doctor' relationships to avoid N+1 performance bottlenecks
        $appointments = Appointment::with(['patient', 'doctor'])
            ->whereIn('status', ['Completed', 'No-show', 'Ongoing'])
            ->when($from && $to, function ($q) use ($from, $to) {
                $q->whereBetween('scheduled_at', [
                    $from . ' 00:00:00',
                    $to . ' 23:59:59',
                ]);
            })
            ->orderBy('appointment_Date', 'desc')
            ->get()
            ->map(function ($a) {
                $total_amount =
                    ($a->amount_1 ?? 0) +
                    ($a->amount_2 ?? 0) +
                    ($a->amount_3 ?? 0);

                $total_payment =
                    ($a->payment_1 ?? 0) +
                    ($a->payment_2 ?? 0) +
                    ($a->payment_3 ?? 0);

                $balance = $total_amount - $total_payment;

                // Safely concatenate Doctor First & Last name if relationship exists
                $docFullName = $a->doctor
                    ? trim(($a->doctor->first_name ?? '') . ' ' . ($a->doctor->last_name ?? ''))
                    : '';

                return [
                    'appointment_id' => $a->appointment_id,
                    'patient_id' => $a->patient_id,
                    'patient_name' => $a->patient
                        ? $a->patient->first_name . ' ' . $a->patient->last_name
                        : '-',
                    
                    // Passing both properties ensures no breakage across code versions
                    'doctor_id' => $a->doctor_id,
                    'doctor_name' => $docFullName !== '' ? 'Dr. ' . $docFullName : '-',
                    
                    'appointment_date' => $a->appointment_Date,
                    'appointment_reason' => $a->app_reason ?? '-',

                    'service_2' => $a->service_2 ?? '',
                    'service_3' => $a->service_3 ?? '',

                    'amount_1' => $a->amount_1 ?? 0,
                    'amount_2' => $a->amount_2 ?? 0,
                    'amount_3' => $a->amount_3 ?? 0,

                    'payment_1' => $a->payment_1 ?? 0,
                    'payment_2' => $a->payment_2 ?? 0,
                    'payment_3' => $a->payment_3 ?? 0,

                    'total_amount' => $total_amount,
                    'total_payment' => $total_payment,
                    'balance' => $balance,

                    'responsibility' => $a->responsibility ?? 'Patient',
                    'claim_status' => $a->claim_status ?? 'Pending',
                    'status' => $a->status ?? '-',
                ];
            });

        return Inertia::render('billing/index', [
            'appointments' => $appointments,
            'from' => $from,
            'to' => $to,
        ]);
    }
    /* Displays the clinical data form for the selected appointment. */
    public function createClinicalData($appointment_id)
    {
        // Eager-load relationships to supply data to your form header banner
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($appointment_id);

        $patientName = $appointment->patient 
            ? trim($appointment->patient->first_name . ' ' . $appointment->patient->last_name) 
            : '-';

        $doctorName = $appointment->doctor 
            ? trim($appointment->doctor->first_name . ' ' . $appointment->doctor->last_name) 
            : '-';

        return Inertia::render('billing/clinicaldata', [
            'appointment' => [
                'appointment_id' => $appointment->appointment_id,
                'patient_id' => $appointment->patient_id,
                'patient_name' => $patientName,
                'doctor_name' => $doctorName !== '-' ? 'Dr. ' . $doctorName : '-',
                'appointment_date' => $appointment->appointment_Date,
                'appointment_reason' => $appointment->app_reason ?? '-',
            ]
        ]);
    }
    /* Validates and saves the patient's clinical data for the selected appointment. */
    public function storeClinicalData(Request $request, $appointment_id)
    {
        $appointment = Appointment::findOrFail($appointment_id);

       
        $validated = $request->validate([
            'blood_pressure'        => ['nullable', 'string', 'max:20'],
            'pulse_rate'            => ['nullable', 'string', 'max:20'], 
            'temperature_c'         => ['nullable', 'string', 'max:20'], 
            'weight_kg'             => ['nullable', 'string', 'max:20'], 
            'chief_complaint'       => ['required', 'string'],
            'clinical_examination'  => ['nullable', 'string'],
            'diagnosis'             => ['nullable', 'string'],
            'prescribed_medication' => ['nullable', 'string'],
            'plan_of_management'    => ['nullable', 'string'],
        ]);

        
        $appointment->update([
            'app_reason'            => $validated['chief_complaint'], // Syncs back presentation text edits
            'blood_pressure'        => $validated['blood_pressure'],
            'pulse_rate'            => $validated['pulse_rate'],
            'temperature_c'         => $validated['temperature_c'],
            'weight_kg'             => $validated['weight_kg'],
            'clinical_examination'  => $validated['clinical_examination'],
            'diagnosis'             => $validated['diagnosis'],
            'prescribed_medication' => $validated['prescribed_medication'],
            'plan_of_management'    => $validated['plan_of_management'],
        ]);

        return redirect()->route('billing.index')->with('success', 'Clinical entry charting added successfully.');
    }
    /* Displays the billing edit form for the selected appointment. */
    public function edit($appointment_id)
    {
        // Eager-load both structures to handle edits gracefully
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($appointment_id);

        $chargeMasters = Billing::orderBy('service_name')->get();

        $docFullName = $appointment->doctor
            ? trim(($appointment->doctor->first_name ?? '') . ' ' . ($appointment->doctor->last_name ?? ''))
            : '';

        return Inertia::render('billing/edit', [
            'appointment' => [
                'appointment_id' => $appointment->appointment_id,
                'patient_id' => $appointment->patient_id,
                'patient_name' => $appointment->patient
                    ? $appointment->patient->first_name . ' ' . $appointment->patient->last_name
                    : '-',
                'doctor_id' => $appointment->doctor_id,
                'doctor_name' => $docFullName !== '' ? 'Dr. ' . $docFullName : '-',

                'appointment_reason' => $appointment->app_reason ?? '',
                'service_2' => $appointment->service_2 ?? '',
                'service_3' => $appointment->service_3 ?? '',

                'amount_1' => $appointment->amount_1 ?? 0,
                'amount_2' => $appointment->amount_2 ?? 0,
                'amount_3' => $appointment->amount_3 ?? 0,

                'payment_1' => $appointment->payment_1 ?? 0,
                'payment_2' => $appointment->payment_2 ?? 0,
                'payment_3' => $appointment->payment_3 ?? 0,

                'total_amount' =>
                    ($appointment->amount_1 ?? 0) +
                    ($appointment->amount_2 ?? 0) +
                    ($appointment->amount_3 ?? 0),

                'total_payment' =>
                    ($appointment->payment_1 ?? 0) +
                    ($appointment->payment_2 ?? 0) +
                    ($appointment->payment_3 ?? 0),

                'balance' =>
                    (($appointment->amount_1 ?? 0) +
                    ($appointment->amount_2 ?? 0) +
                    ($appointment->amount_3 ?? 0)) -
                    (($appointment->payment_1 ?? 0) +
                    ($appointment->payment_2 ?? 0) +
                    ($appointment->payment_3 ?? 0)),

                'responsibility' => $appointment->responsibility ?? 'Patient',
                'claim_status' => $appointment->claim_status ?? 'Pending',
                'status' => $appointment->status ?? 'Ongoing',
            ],

            'chargeMasters' => $chargeMasters,
        ]);
    }
    /* Validates and updates the billing details for the selected appointment. */
    public function update(Request $request, $appointment_id)
    {
        $appointment = Appointment::findOrFail($appointment_id);

        $validated = $request->validate([
            'appointment_reason' => ['required', 'string', 'max:255'],
            'service_2' => ['nullable', 'string', 'max:255'],
            'service_3' => ['nullable', 'string', 'max:255'],

            'amount_1' => ['nullable', 'numeric', 'min:0'],
            'amount_2' => ['nullable', 'numeric', 'min:0'],
            'amount_3' => ['nullable', 'numeric', 'min:0'],

            'payment_1' => ['nullable', 'numeric', 'min:0'],
            'payment_2' => ['nullable', 'numeric', 'min:0'],
            'payment_3' => ['nullable', 'numeric', 'min:0'],

            'responsibility' => ['required', 'in:Patient,Insurance'],
            'claim_status' => ['required', 'in:Pending,Ready to Bill,Billed'],
            'status' => ['required', 'in:Scheduled,Ongoing,Completed,No-show,Cancelled'],
        ]);

        $appointment->update([
            'app_reason' => $validated['appointment_reason'],

            'service_2' => $validated['service_2'] ?? null,
            'service_3' => $validated['service_3'] ?? null,

            'amount_1' => $validated['amount_1'] ?? 0,
            'amount_2' => $validated['amount_2'] ?? 0,
            'amount_3' => $validated['amount_3'] ?? 0,

            'payment_1' => $validated['payment_1'] ?? 0,
            'payment_2' => $validated['payment_2'] ?? 0,
            'payment_3' => $validated['payment_3'] ?? 0,

            'responsibility' => $validated['responsibility'],
            'claim_status' => $validated['claim_status'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('billing.index')
            ->with('success', 'Visit updated successfully.');
    }
    /* Displays the billing summary and invoice details for the selected appointment. */
    public function bill($appointment_id)
    {
        $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($appointment_id);

        $total_amount =
            ($appointment->amount_1 ?? 0) +
            ($appointment->amount_2 ?? 0) +
            ($appointment->amount_3 ?? 0);

        $total_payment =
            ($appointment->payment_1 ?? 0) +
            ($appointment->payment_2 ?? 0) +
            ($appointment->payment_3 ?? 0);

        $balance = $total_amount - $total_payment;

        $docFullName = $appointment->doctor
            ? trim(($appointment->doctor->first_name ?? '') . ' ' . ($appointment->doctor->last_name ?? ''))
            : '';

        return Inertia::render('billing/bill', [
            'bill' => [
                'patient_name' => $appointment->patient
                    ? $appointment->patient->first_name . ' ' . $appointment->patient->last_name
                    : '-',
                'age' => $appointment->patient->age ?? '-',
                
                // Displays actual text string name on your Invoice panel
                'doctor_name' => $docFullName !== '' ? 'Dr. ' . $docFullName : '-',
                
                'date_of_service' => $appointment->appointment_Date,
                'appointment_id' => $appointment->appointment_id,
                'appointment_reason' => $appointment->app_reason ?? '',
                'service_2' => $appointment->service_2 ?? '',
                'service_3' => $appointment->service_3 ?? '',

                'amount_1' => $appointment->amount_1 ?? 0,
                'amount_2' => $appointment->amount_2 ?? 0,
                'amount_3' => $appointment->amount_3 ?? 0,

                'payment_1' => $appointment->payment_1 ?? 0,
                'payment_2' => $appointment->payment_2 ?? 0,
                'payment_3' => $appointment->payment_3 ?? 0,

                'total_amount' => $total_amount,
                'total_payment' => $total_payment,
                'balance' => $balance,
            ],
        ]);
    }
    /* Displays the payment posting page for the selected appointment. */
    public function payment($appointment_id)
    {
        $appointment = Appointment::findOrFail($appointment_id);

        $total_amount =
            ($appointment->amount_1 ?? 0) +
            ($appointment->amount_2 ?? 0) +
            ($appointment->amount_3 ?? 0);

        $total_payment =
            ($appointment->payment_1 ?? 0) +
            ($appointment->payment_2 ?? 0) +
            ($appointment->payment_3 ?? 0);

        $balance = $total_amount - $total_payment;

        return Inertia::render('billing/payment', [
            'appointment' => [
                'appointment_id' => $appointment->appointment_id,
                'appointment_reason' => $appointment->app_reason ?? '',
                'service_2' => $appointment->service_2 ?? '',
                'service_3' => $appointment->service_3 ?? '',

                'amount_1' => $appointment->amount_1 ?? 0,
                'amount_2' => $appointment->amount_2 ?? 0,
                'amount_3' => $appointment->amount_3 ?? 0,

                'payment_1' => $appointment->payment_1 ?? 0,
                'payment_2' => $appointment->payment_2 ?? 0,
                'payment_3' => $appointment->payment_3 ?? 0,

                'total_amount' => $total_amount,
                'total_payment' => $total_payment,
                'balance' => $balance,
            ],
        ]);
    }
    /* Validates and saves the payment details for the selected appointment. */
    public function storePayment(Request $request, $appointment_id)
    {
        $appointment = Appointment::findOrFail($appointment_id);

        $validated = $request->validate([
            'payment_1' => ['nullable', 'numeric', 'min:0'],
            'payment_2' => ['nullable', 'numeric', 'min:0'],
            'payment_3' => ['nullable', 'numeric', 'min:0'],
        ]);

        $appointment->update([
            'payment_1' => $validated['payment_1'] ?? 0,
            'payment_2' => $validated['payment_2'] ?? 0,
            'payment_3' => $validated['payment_3'] ?? 0,
        ]);

        return redirect()->route('billing.index')
            ->with('success', 'Payment posted successfully.');
    }
    /* Updates the billing responsibility and claim status for the selected appointment. */
    public function updateStatus(Request $request, $appointment_id)
    {
        $appointment = Appointment::findOrFail($appointment_id);

        $validated = $request->validate([
            'responsibility' => 'required|in:Patient,Insurance',
            'claim_status' => 'required|in:Pending,Ready to Bill,Billed',
        ]);

        $appointment->update([
            'responsibility' => $validated['responsibility'],
            'claim_status' => $validated['claim_status'],
        ]);

        return back();
    }
    /* Generates and downloads the PDF bill for the selected appointment. */
    public function downloadBill($appointment_id)
{
    // Eager-load relations to pull patient details and linked doctor names smoothly
    $appointment = Appointment::with(['patient', 'doctor'])->findOrFail($appointment_id);

    $total_amount =
        ($appointment->amount_1 ?? 0) +
        ($appointment->amount_2 ?? 0) +
        ($appointment->amount_3 ?? 0);

    $total_payment =
        ($appointment->payment_1 ?? 0) +
        ($appointment->payment_2 ?? 0) +
        ($appointment->payment_3 ?? 0);

    $balance = max($total_amount - $total_payment, 0);

    $data = [
        'appointment'   => $appointment,
        'total_amount'  => $total_amount,
        'total_payment' => $total_payment,
        'balance'       => $balance,
    ];

    // Compiles the resources/views/pdf/bill.blade.php layout file code string
    $pdf = Pdf::loadView('pdf.bill', $data);

    return $pdf->download('bill-' . $appointment->appointment_id . '.pdf');
}
}
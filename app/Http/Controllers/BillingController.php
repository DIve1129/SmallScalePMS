<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;
use App\Models\Billing;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->input('from');
        $to = $request->input('to');

        $appointments = Appointment::with('patient')
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

                return [
                    'appointment_id' => $a->appointment_id,
                    'patient_id' => $a->patient_id,
                    'patient_name' => $a->patient
                        ? $a->patient->first_name . ' ' . $a->patient->last_name
                        : '-',
                    'doctor_id' => $a->doctor_id,
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

    public function edit($appointment_id)
    {
        $appointment = Appointment::with('patient')->findOrFail($appointment_id);

        $chargeMasters = Billing::orderBy('service_name')->get();

        return Inertia::render('billing/edit', [
            'appointment' => [
                'appointment_id' => $appointment->appointment_id,
                'patient_id' => $appointment->patient_id,
                'patient_name' => $appointment->patient
                    ? $appointment->patient->first_name . ' ' . $appointment->patient->last_name
                    : '-',
                'doctor_id' => $appointment->doctor_id,

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

    public function bill($appointment_id)
    {
        $appointment = Appointment::with('patient')->findOrFail($appointment_id);

        $total_amount =
            ($appointment->amount_1 ?? 0) +
            ($appointment->amount_2 ?? 0) +
            ($appointment->amount_3 ?? 0);

        $total_payment =
            ($appointment->payment_1 ?? 0) +
            ($appointment->payment_2 ?? 0) +
            ($appointment->payment_3 ?? 0);

        $balance = $total_amount - $total_payment;

        return Inertia::render('billing/bill', [
            'bill' => [
                'patient_name' => $appointment->patient
                    ? $appointment->patient->first_name . ' ' . $appointment->patient->last_name
                    : '-',
                'age' => $appointment->patient->age ?? '-',
                'doctor_name' => $appointment->doctor_id ?? '-',
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

    public function downloadBill($appointment_id)
{
    $appointment = Appointment::with('patient')->findOrFail($appointment_id);

    $total_amount =
        ($appointment->amount_1 ?? 0) +
        ($appointment->amount_2 ?? 0) +
        ($appointment->amount_3 ?? 0);

    $total_payment =
        ($appointment->payment_1 ?? 0) +
        ($appointment->payment_2 ?? 0) +
        ($appointment->payment_3 ?? 0);

    $balance = $total_amount - $total_payment;

    $data = [
        'appointment' => $appointment,
        'total_amount' => $total_amount,
        'total_payment' => $total_payment,
        'balance' => $balance,
    ];

    $pdf = Pdf::loadView('pdf.bill', $data);

    return $pdf->download('bill-' . $appointment->appointment_id . '.pdf');
}
}
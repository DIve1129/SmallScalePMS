<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Revenue Collection Report
     * Displays each paid service as a separate row and filters
     * appointments using the selected date-of-service range.
     */
    public function index(Request $request)
    {
        $from = $request->input(
            'from',
            now()->startOfMonth()->toDateString()
        );

        $to = $request->input(
            'to',
            now()->toDateString()
        );

        $validated = validator(
            [
                'from' => $from,
                'to' => $to,
            ],
            [
                'from' => ['required', 'date'],
                'to' => ['required', 'date', 'after_or_equal:from'],
            ]
        )->validate();

        $appointments = Appointment::with(['patient', 'doctor'])
            ->whereDate('scheduled_at', '>=', $validated['from'])
            ->whereDate('scheduled_at', '<=', $validated['to'])
            ->orderBy('scheduled_at')
            ->get();

        $revenueRows = $appointments
            ->flatMap(function (Appointment $appointment) {
                $patientName = $this->getPatientName($appointment);
                $doctorName = $this->getDoctorName($appointment);
                $dos = $this->getDos($appointment);

                $services = [
                    [
                        'service' => $appointment->app_reason,
                        'payment' => (float) ($appointment->payment_1 ?? 0),
                    ],
                    [
                        'service' => $appointment->service_2,
                        'payment' => (float) ($appointment->payment_2 ?? 0),
                    ],
                    [
                        'service' => $appointment->service_3,
                        'payment' => (float) ($appointment->payment_3 ?? 0),
                    ],
                ];

                return collect($services)
                    ->filter(function (array $service) {
                        return filled($service['service'])
                            && $service['payment'] > 0;
                    })
                    ->map(function (
                        array $service,
                        int $index
                    ) use (
                        $appointment,
                        $patientName,
                        $doctorName,
                        $dos
                    ) {
                        return [
                            'row_id' =>
                                $appointment->appointment_id .
                                '-revenue-' .
                                ($index + 1),

                            'appointment_id' =>
                                $appointment->appointment_id,

                            'patient' => $patientName,
                            'doctor' => $doctorName,
                            'dos' => $dos,
                            'service' => $service['service'],
                            'payment' => $service['payment'],
                        ];
                    });
            })
            ->values();

        $totalRevenue = $revenueRows->sum('payment');

        return Inertia::render('reports/revenue', [
            'rows' => $revenueRows,

            'filters' => [
                'from' => $validated['from'],
                'to' => $validated['to'],
            ],

            'totalRevenue' => $totalRevenue,
        ]);
    }

    /**
     * Patient Billing Summary Report
    */
    public function patientBilling(Request $request){
        $validated = $request->validate([
            'patient_id'=>['nullable','string','exists:patients,patient_id',
            ],
        ]);
    /*
     * Provide the patient selector with every available patient.
     * Only the fields required by the frontend are selected.
     */

        $patients = Patient::query()
        ->select([
            'patient_id',
            'first_name',
            'last_name',
        ])
        ->orderBy('first_name')
        ->orderBy('last_name')
        ->get()
        ->map(function (Patient $patient){
            $name = trim(
                ($patient->first_name ?? '') .
                ' ' .
                ($patient->last_name ?? '')
            );
            return [
            'patient_id' => $patient->patient_id,
            'name' => $name !== '' ? $name : 'Unnamed Patient',
            ];
        })
        ->values();
        
        /*
     * Return the report page without billing rows when no patient
     * has been selected yet.
     */
    if (empty($validated['patient_id'])) {
        return Inertia::render('reports/patientbilling', [
            'patients' => $patients,
            'selectedPatient' => null,
            'rows' => [],
            'filters' => [
                'patient_id' => null,
            ],
            'summary' => [
                'total_charges' => 0,
                'total_payments' => 0,
                'outstanding_balance' => 0,
                'service_count' => 0,
            ],
        ]);
    }

    /*
     * Retrieve the selected patient.
     * Validation already confirms that this patient exists.
     */
    $selectedPatient = Patient::query()
        ->select([
            'patient_id',
            'first_name',
            'last_name',
            'phone',
            'insurance_name',
            'insurance_id',
        ])
        ->where(
            'patient_id',
            $validated['patient_id']
        )
        ->firstOrFail();

    /*
     * Retrieve all appointments belonging to the selected patient.
     *
     * Billing information is stored in appointments using three
     * possible service, charge, and payment fields.
     */
    $appointments = Appointment::query()
        ->where(
            'patient_id',
            $selectedPatient->patient_id
        )
        ->orderByDesc('scheduled_at')
        ->get();

    /*
     * Convert each appointment's three possible service slots into
     * separate report rows.
     */
    $rows = $appointments
        ->flatMap(function (Appointment $appointment) {
            $services = [
                [
                    'service' => $appointment->app_reason,
                    'charge' => (float) ($appointment->amount_1 ?? 0),
                    'paid' => (float) ($appointment->payment_1 ?? 0),
                ],
                [
                    'service' => $appointment->service_2,
                    'charge' => (float) ($appointment->amount_2 ?? 0),
                    'paid' => (float) ($appointment->payment_2 ?? 0),
                ],
                [
                    'service' => $appointment->service_3,
                    'charge' => (float) ($appointment->amount_3 ?? 0),
                    'paid' => (float) ($appointment->payment_3 ?? 0),
                ],
            ];

            return collect($services)
                ->map(function (
                    array $service,
                    int $index
                ) use ($appointment) {
                    /*
                     * Prevent a negative outstanding balance if a payment
                     * is greater than the corresponding charge.
                     */
                    $outstanding = max(
                        $service['charge'] - $service['paid'],
                        0
                    );

                    return [
                        'row_id' =>
                            $appointment->appointment_id .
                            '-patientbilling-' .
                            ($index + 1),

                        'appointment_id' =>
                            $appointment->appointment_id,

                        'dos' =>
                            $this->getDos($appointment),

                        'service' =>
                            $service['service'],

                        'charge' =>
                            $service['charge'],

                        'paid' =>
                            $service['paid'],

                        'outstanding' =>
                            $outstanding,
                    ];
                })
                ->filter(function (array $row) {
                    /*
                     * Exclude empty service slots and rows without
                     * any recorded financial activity.
                     */
                    return filled($row['service'])
                        && (
                            $row['charge'] > 0 ||
                            $row['paid'] > 0
                        );
                });
        })
        ->values();

    /*
     * Calculate the summary values from the same rows displayed
     * in the report table.
     */
    $summary = [
        'total_charges' =>
            $rows->sum('charge'),

        'total_payments' =>
            $rows->sum('paid'),

        'outstanding_balance' =>
            $rows->sum('outstanding'),

        'service_count' =>
            $rows->count(),
    ];

    $patientName = trim(
        ($selectedPatient->first_name ?? '') .
        ' ' .
        ($selectedPatient->last_name ?? '')
    );

    return Inertia::render('reports/patientbilling', [
        'patients' => $patients,

        'selectedPatient' => [
            'patient_id' =>
                $selectedPatient->patient_id,

            'name' =>
                $patientName !== ''
                    ? $patientName
                    : 'Unnamed Patient',

            'phone' =>
                $selectedPatient->phone,

            'insurance_name' =>
                $selectedPatient->insurance_name,

            'insurance_id' =>
                $selectedPatient->insurance_id,
        ],

        'rows' => $rows,

        'filters' => [
            'patient_id' =>
                $selectedPatient->patient_id,
        ],

        'summary' => $summary,
    ]);
}
    

    /**
     * Appointment Summary Report
     * Compares appointment totals for the previous month,
     * selected month, and next month.
     */
    public function appointments(Request $request)
    {
        $selectedMonth = $request->input(
            'month',
            now()->format('Y-m')
        );

        $validated = validator(
            [
                'month' => $selectedMonth,
            ],
            [
                'month' => ['required', 'date_format:Y-m'],
            ]
        )->validate();

        /*Use standard PHP date objects so no Carbon import is required.*/
        $selectedStart = new \DateTimeImmutable(
            $validated['month'] . '-01 00:00:00'
        );

        $selectedEnd = $selectedStart
            ->modify('last day of this month')
            ->setTime(23, 59, 59);

        $previousStart = $selectedStart->modify('-1 month');

        $previousEnd = $previousStart
            ->modify('last day of this month')
            ->setTime(23, 59, 59);

        $nextStart = $selectedStart->modify('+1 month');

        $nextEnd = $nextStart
            ->modify('last day of this month')
            ->setTime(23, 59, 59);

        $previousCount = Appointment::query()
            ->whereBetween('scheduled_at', [
                $previousStart->format('Y-m-d H:i:s'),
                $previousEnd->format('Y-m-d H:i:s'),
            ])
            ->count();

        $selectedAppointments = Appointment::query()
            ->whereBetween('scheduled_at', [
                $selectedStart->format('Y-m-d H:i:s'),
                $selectedEnd->format('Y-m-d H:i:s'),
            ])
            ->get();

        $selectedCount = $selectedAppointments->count();

        $nextCount = Appointment::query()
            ->whereBetween('scheduled_at', [
                $nextStart->format('Y-m-d H:i:s'),
                $nextEnd->format('Y-m-d H:i:s'),
            ])
            ->count();

        /*
        * Calculate the percentage change from the previous month
        * to the selected month.
        */
        $changeFromPrevious = $previousCount > 0
            ? round(
                (($selectedCount - $previousCount) / $previousCount) * 100,
                2
            )
            : null;

        /*
        * Calculate the percentage change from the selected month to the next month.
        */
        $changeToNext = $selectedCount > 0
            ? round(
                (($nextCount - $selectedCount) / $selectedCount) * 100,
                2
            )
            : null;

        /*
        * Group the selected month's appointments by status.
        * Empty statuses are shown as "Not Specified".
        */
        $statusSummary = $selectedAppointments
            ->groupBy(function (Appointment $appointment) {
                $status = trim((string) $appointment->status);

                return $status !== ''
                    ? ucfirst(strtolower($status))
                    : 'Not Specified';
            })
            ->map(function ($appointments, string $status) {
                return [
                    'status' => $status,
                    'count' => $appointments->count(),
                ];
            })
            ->values()
            ->sortByDesc('count')
            ->values();

        $monthlyComparison = [
            [
                'key' => 'previous',
                'month' => $previousStart->format('M Y'),
                'count' => $previousCount,
            ],
            [
                'key' => 'selected',
                'month' => $selectedStart->format('M Y'),
                'count' => $selectedCount,
            ],
            [
                'key' => 'next',
                'month' => $nextStart->format('M Y'),
                'count' => $nextCount,
            ],
        ];

        return Inertia::render('reports/appointments', [
            'filters' => [
                'month' => $validated['month'],
            ],

            'monthlyComparison' => $monthlyComparison,

            'summary' => [
                'previous_count' => $previousCount,
                'selected_count' => $selectedCount,
                'next_count' => $nextCount,
                'change_from_previous' => $changeFromPrevious,
                'change_to_next' => $changeToNext,
            ],

            'statusSummary' => $statusSummary,
        ]);
    }

    /**
     * Outstanding Balance Report
     * Displays each unpaid or partially paid service as a separate row.
     * Outstanding balance is calculated as charge minus payment.
     */
    public function outstanding(Request $request)
    {
        $from = $request->input(
            'from',
            now()->startOfMonth()->toDateString()
        );

        $to = $request->input(
            'to',
            now()->toDateString()
        );

        $validated = validator(
            [
                'from' => $from,
                'to' => $to,
            ],
            [
                'from' => ['required', 'date'],
                'to' => ['required', 'date', 'after_or_equal:from'],
            ]
        )->validate();

        $appointments = Appointment::with(['patient', 'doctor'])
            ->whereDate('scheduled_at', '>=', $validated['from'])
            ->whereDate('scheduled_at', '<=', $validated['to'])
            ->orderBy('scheduled_at')
            ->get();

        $outstandingRows = $appointments
            ->flatMap(function (Appointment $appointment) {
                $patientName = $this->getPatientName($appointment);
                $doctorName = $this->getDoctorName($appointment);
                $dos = $this->getDos($appointment);

                $services = [
                    [
                        'service' => $appointment->app_reason,
                        'charge' => (float) ($appointment->amount_1 ?? 0),
                        'paid' => (float) ($appointment->payment_1 ?? 0),
                    ],
                    [
                        'service' => $appointment->service_2,
                        'charge' => (float) ($appointment->amount_2 ?? 0),
                        'paid' => (float) ($appointment->payment_2 ?? 0),
                    ],
                    [
                        'service' => $appointment->service_3,
                        'charge' => (float) ($appointment->amount_3 ?? 0),
                        'paid' => (float) ($appointment->payment_3 ?? 0),
                    ],
                ];

                return collect($services)
                    ->map(function (
                        array $service,
                        int $index
                    ) use (
                        $appointment,
                        $patientName,
                        $doctorName,
                        $dos
                    ) {
                        $outstanding = max(
                            $service['charge'] - $service['paid'],
                            0
                        );

                        return [
                            'row_id' =>
                                $appointment->appointment_id .
                                '-outstanding-' .
                                ($index + 1),

                            'appointment_id' =>
                                $appointment->appointment_id,

                            'patient' => $patientName,
                            'doctor' => $doctorName,
                            'dos' => $dos,
                            'service' => $service['service'],
                            'charge' => $service['charge'],
                            'paid' => $service['paid'],
                            'outstanding' => $outstanding,
                        ];
                    })
                    ->filter(function (array $row) {
                        return filled($row['service'])
                            && $row['charge'] > 0
                            && $row['outstanding'] > 0;
                    });
            })
            ->values();

        $summary = [
            'total_charges' => $outstandingRows->sum('charge'),
            'total_paid' => $outstandingRows->sum('paid'),
            'total_outstanding' => $outstandingRows->sum('outstanding'),
            'outstanding_services' => $outstandingRows->count(),
        ];

        return Inertia::render('reports/outstanding', [
            'rows' => $outstandingRows,

            'filters' => [
                'from' => $validated['from'],
                'to' => $validated['to'],
            ],

            'summary' => $summary,
        ]);
    }

    /**
     * Build the patient's full name.
     */
    private function getPatientName(Appointment $appointment): string
    {
        if (!$appointment->patient) {
            return '-';
        }

        $name = trim(
            ($appointment->patient->first_name ?? '') .
            ' ' .
            ($appointment->patient->last_name ?? '')
        );

        return $name !== '' ? $name : '-';
    }

    /**
     * Build the doctor's full name.
     */
    private function getDoctorName(Appointment $appointment): string
    {
        if (!$appointment->doctor) {
            return '-';
        }

        $name = trim(
            ($appointment->doctor->first_name ?? '') .
            ' ' .
            ($appointment->doctor->last_name ?? '')
        );

        return $name !== '' ? 'Dr. ' . $name : '-';
    }

    /**
     * Return the appointment DOS as YYYY-MM-DD.
     */
    private function getDos(Appointment $appointment): string
        {
            if (!empty($appointment->scheduled_at)) {
                return date(
                    'Y-m-d',
                    strtotime((string) $appointment->scheduled_at)
                );
            }

            return $appointment->appointment_Date ?? '-';
        }
}
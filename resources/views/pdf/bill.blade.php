<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bill</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 13px;
            color: #111;
        }

        h1 {
            text-align: center;
            margin-bottom: 20px;
        }

        .section {
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
        }

        th {
            background: #eee;
        }

        .total {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Patient Bill</h1>

    <div class="section">
        <p><strong>Patient:</strong>
            {{ $appointment->patient ? $appointment->patient->first_name . ' ' . $appointment->patient->last_name : '-' }}
        </p>
        <p><strong>Appointment ID:</strong> {{ $appointment->appointment_id }}</p>
        <p><strong>Date of Service:</strong> {{ $appointment->appointment_Date }}</p>
        <p><strong>Doctor ID:</strong> {{ $appointment->doctor_id }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Service</th>
                <th>Amount</th>
                <th>Payment</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ $appointment->app_reason ?? '-' }}</td>
                <td>Rs {{ number_format($appointment->amount_1 ?? 0, 2) }}</td>
                <td>Rs {{ number_format($appointment->payment_1 ?? 0, 2) }}</td>
            </tr>

            @if($appointment->service_2)
                <tr>
                    <td>{{ $appointment->service_2 }}</td>
                    <td>Rs {{ number_format($appointment->amount_2 ?? 0, 2) }}</td>
                    <td>Rs {{ number_format($appointment->payment_2 ?? 0, 2) }}</td>
                </tr>
            @endif

            @if($appointment->service_3)
                <tr>
                    <td>{{ $appointment->service_3 }}</td>
                    <td>Rs {{ number_format($appointment->amount_3 ?? 0, 2) }}</td>
                    <td>Rs {{ number_format($appointment->payment_3 ?? 0, 2) }}</td>
                </tr>
            @endif

            <tr class="total">
                <td>Total</td>
                <td>Rs {{ number_format($total_amount, 2) }}</td>
                <td>Rs {{ number_format($total_payment, 2) }}</td>
            </tr>

            <tr class="total">
                <td colspan="2">Balance</td>
                <td>Rs {{ number_format($balance, 2) }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
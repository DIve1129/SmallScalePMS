<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice - {{ $appointment->appointment_id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
            font-size: 14px;
            line-height: 1.5;
        }
        .invoice-header {
            margin-bottom: 30px;
            border-bottom: 2px solid #eee;
            padding-bottom: 20px;
        }
        .hospital-title {
            font-size: 24px;
            font-weight: bold;
            color: #111;
            margin: 0 0 5px 0;
        }
        .invoice-label {
            font-size: 20px;
            text-transform: uppercase;
            color: #666;
            text-align: right;
            float: right;
            margin-top: -35px;
        }
        .meta-grid {
            width: 100%;
            margin-bottom: 40px;
        }
        .meta-grid td {
            padding: 4px 0;
            vertical-align: top;
        }
        .meta-label {
            font-weight: bold;
            color: #555;
            width: 120px;
        }
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .invoice-table th {
            background-color: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
            font-weight: bold;
        }
        .invoice-table td {
            padding: 12px;
            border-bottom: 1px solid #dee2e6;
        }
        .text-right {
            text-align: right !important;
        }
        .summary-container {
            float: right;
            width: 300px;
            margin-top: 20px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }
        .summary-table td {
            padding: 8px 0;
        }
        .summary-table .total-row td {
            border-top: 1px solid #ddd;
            font-size: 16px;
            font-weight: bold;
            padding-top: 12px;
        }
    </style>
</head>
<body>

    <div class="invoice-header">
        <h1 class="hospital-title">Practice Management System</h1>
        <div class="invoice-label">Patient Invoice</div>
    </div>

    <table class="meta-grid">
        <tr>
            <td class="meta-label">Patient Name:</td>
            <td>{{ $appointment->patient ? ($appointment->patient->first_name . ' ' . $appointment->patient->last_name) : '-' }}</td>
            <td class="meta-label text-right">Invoice ID:</td>
            <td class="text-right">#{{ $appointment->appointment_id }}</td>
        </tr>
        <tr>
            <td class="meta-label">Age:</td>
            <td>{{ $appointment->patient->age ?? '-' }}</td>
            <td class="meta-label text-right">Date of Service:</td>
            <td class="text-right">{{ $appointment->appointment_Date }}</td>
        </tr>
        <tr>
            <td class="meta-label">Doctor:</td>
            <td>
                @if($appointment->doctor)
                    Dr. {{ $appointment->doctor->first_name }} {{ $appointment->doctor->last_name }}
                @else
                    -
                @endif
            </td>
            <td></td>
            <td></td>
        </tr>
    </table>

    <table class="invoice-table">
        <thead>
            <tr>
                <th>Service Description</th>
                <th class="text-right">Charge</th>
            </tr>
        </thead>
        <tbody>
            @if($appointment->app_reason || $appointment->amount_1 > 0)
            <tr>
                <td>{{ $appointment->app_reason ?? 'Medical Encounter Base Consultation' }}</td>
                <td class="text-right">Rs {{ number_format($appointment->amount_1 ?? 0, 2) }}</td>
            </tr>
            @endif

            @if($appointment->service_2 || $appointment->amount_2 > 0)
            <tr>
                <td>{{ $appointment->service_2 }}</td>
                <td class="text-right">Rs {{ number_format($appointment->amount_2 ?? 0, 2) }}</td>
            </tr>
            @endif

            @if($appointment->service_3 || $appointment->amount_3 > 0)
            <tr>
                <td>{{ $appointment->service_3 }}</td>
                <td class="text-right">Rs {{ number_format($appointment->amount_3 ?? 0, 2) }}</td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="summary-container">
        <table class="summary-table">
            <tr>
                <td class="meta-label">Total Charge:</td>
                <td class="text-right">Rs {{ number_format($total_amount, 2) }}</td>
            </tr>
            <tr>
                <td class="meta-label">Payment Made:</td>
                <td class="text-right">Rs {{ number_format($total_payment, 2) }}</td>
            </tr>
            <tr class="total-row">
                <td>Balance Due:</td>
                <td class="text-right">Rs {{ number_format($balance, 2) }}</td>
            </tr>
        </table>
    </div>

</body>
</html>
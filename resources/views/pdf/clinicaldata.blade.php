<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Clinical Record - #{{ $appointment->appointment_id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #222;
            margin: 0;
            padding: 15px;
            font-size: 13px;
            line-height: 1.6;
        }
        .header {
            margin-bottom: 25px;
            border-b: 2px solid #111;
            padding-bottom: 15px;
        }
        .title {
            font-size: 22px;
            font-weight: bold;
            color: #111;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .subtitle {
            font-size: 12px;
            color: #555;
            margin: 5px 0 0 0;
        }
        .meta-table {
            width: 100%;
            margin-bottom: 30px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
        }
        .meta-table td {
            padding: 8px 12px;
            vertical-align: top;
            border: 1px solid #dee2e6;
        }
        .label {
            font-weight: bold;
            color: #444;
            width: 140px;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #111;
            border-bottom: 1px solid #111;
            padding-bottom: 5px;
            margin-top: 25px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .vitals-grid {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .vitals-grid td {
            width: 25%;
            padding: 10px;
            border: 1px solid #dee2e6;
            text-align: center;
        }
        .vitals-val {
            font-size: 16px;
            font-weight: bold;
            color: #111;
            margin-top: 4px;
        }
        .content-box {
            width: 100%;
            padding: 12px;
            border: 1px solid #dee2e6;
            background-color: #fff;
            min-height: 50px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .diagnosis-text {
            font-size: 14px;
            font-weight: bold;
            color: #065f46;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">Clinical Encounter Record</h1>
        <p class="subtitle">Official Electronic Health Record (EHR) Progress Chart</p>
    </div>

    <table class="meta-table" cellspacing="0">
        <tr>
            <td class="label">Patient Name:</td>
            <td>{{ $appointment->patient ? ($appointment->patient->first_name . ' ' . $appointment->patient->last_name) : '-' }}</td>
            <td class="label">Patient ID:</td>
            <td>#{{ $appointment->patient_id }}</td>
        </tr>
        <tr>
            <td class="label">Attending Doctor:</td>
            <td>
                @if($appointment->doctor)
                    Dr. {{ $appointment->doctor->first_name }} {{ $appointment->doctor->last_name }}
                @else
                    -
                @endif
            </td>
            <td class="label">Encounter Date:</td>
            <td>{{ $appointment->appointment_Date }}</td>
        </tr>
        <tr>
            <td class="label">Encounter ID:</td>
            <td>#{{ $appointment->appointment_id }}</td>
            <td class="label">Age:</td>
            <td>{{ $appointment->patient->age ?? '-' }}</td>
        </tr>
    </table>

    <div class="section-title">1. Patient Vital Signs & Triage</div>
    <table class="vitals-grid" cellspacing="0">
        <tr>
            <td>
                <div class="label" style="width:100%; text-align:center;">Blood Pressure</div>
                <div class="vitals-val">{{ $appointment->blood_pressure ?? '-' }} <span style="font-size:10px; font-weight:normal; color:#666;">mmHg</span></div>
            </td>
            <td>
                <div class="label" style="width:100%; text-align:center;">Pulse Rate</div>
                <div class="vitals-val">{{ $appointment->pulse_rate ?? '-' }} <span style="font-size:10px; font-weight:normal; color:#666;">bpm</span></div>
            </td>
            <td>
                <div class="label" style="width:100%; text-align:center;">Temperature</div>
                <div class="vitals-val">{{ $appointment->temperature_c ?? '-' }} <span style="font-size:10px; font-weight:normal; color:#666;">°C</span></div>
            </td>
            <td>
                <div class="label" style="width:100%; text-align:center;">Body Weight</div>
                <div class="vitals-val">{{ $appointment->weight_kg ?? '-' }} <span style="font-size:10px; font-weight:normal; color:#666;">kg</span></div>
            </td>
        </tr>
    </table>

    <div class="section-title">2. Presentation & Clinical Assessment</div>
    
    <div class="label" style="margin-bottom:4px;">Chief Complaint / History of Present Illness:</div>
    <div class="content-box">{{ $appointment->app_reason ?? '-' }}</div>
    
    <div class="label" style="margin-top:15px; margin-bottom:4px;">Physical / Clinical Examination Notes:</div>
    <div class="content-box">{{ $appointment->clinical_examination ?? 'No secondary clinical observations recorded.' }}</div>

    <div class="label" style="margin-top:15px; margin-bottom:4px;">Working / Final Diagnosis:</div>
    <div class="content-box">
        <span class="{{ $appointment->diagnosis ? 'diagnosis-text' : '' }}">
            {{ $appointment->diagnosis ?? 'No structural diagnosis indexed.' }}
        </span>
    </div>

    <div class="section-title">3. Management Plan & Treatment Directives</div>

    <div class="label" style="margin-bottom:4px;">Prescribed Medications & Dosage Protocols:</div>
    <div class="content-box" style="font-family: monospace; background-color: #fafafa;">{{ $appointment->prescribed_medication ?? 'No medications issued.' }}</div>

    <div class="label" style="margin-top:15px; margin-bottom:4px;">Plan of Management / Care Advisories:</div>
    <div class="content-box">{{ $appointment->plan_of_management ?? 'Routine follow-up protocols apply.' }}</div>

</body>
</html>
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;

class Appointment extends Model
{
    protected $primaryKey = 'appointment_id';

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'app_reason',
        'scheduled_at',
        'appointment_Date',
        'status',

        'service_2',
        'service_3',
        'amount_1',
        'amount_2',
        'amount_3',

        'payment_1',
        'payment_2',
        'payment_3',

        'additional_services',
        'additional_charge',
        'notes',

        'responsibility',
        'claim_status',
        'balance',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}
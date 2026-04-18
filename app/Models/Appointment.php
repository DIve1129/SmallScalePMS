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
            'bill_amount',
            'balance',
            'responsibility',
            'claim_status',
            'additional_services',
            'notes',
            'additional_charge',
];

public function patient()
{
    return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
}

}



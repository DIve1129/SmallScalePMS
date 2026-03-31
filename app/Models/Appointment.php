<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Patient;

class Appointment extends Model
{
    protected $primaryKey = 'appointment_id';

    protected $fillable = [
        'appointment_Date',
        'doctor_id',
        'patient_id',
        'app_reason',
        'scheduled_at',
        'status',
];

public function patient()
{
    return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
}

}



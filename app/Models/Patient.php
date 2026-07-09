<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients';

    protected $primaryKey = 'patient_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
    'patient_id',
    'first_name',
    'last_name',
    'dob',
    'age',
    'nic',
    'address',
    'phone',
    'email',
    'insurance_name',
    'insurance_id',
    'notes',
];
}

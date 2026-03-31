<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    protected $table = 'patients';

    protected $primaryKey = 'patient_id';

    public $incrementing = true;

    protected $keyType = 'int';

    protected $fillable = [
        'first_name',
        'last_name',
        'address',
        'nic',
        'phone',
        'insurance_name',
        'insurance_id',
        'insurance_code',
    ];
}
